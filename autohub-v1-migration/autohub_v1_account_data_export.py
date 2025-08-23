import sys
import uuid
import time
import json
import base64
import requests
import traceback
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore


LOG_FILENAME="migration_log.txt"
EXPORT_FILENAME = "autohub_v2_migration_data.json"
FIREBASE_SERVICE_ACCOUNT_KEY_PATH = "./firebase-service-account-key.json"

LOG_FP = None

def open_log_fp():
    global LOG_FP
    LOG_FP = open(LOG_FILENAME, "a")

def close_log_fp():
    global LOG_FP
    LOG_FP.close()

def write_log(msg):
    global LOG_FP
    formatted_msg = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n"
    print(formatted_msg)
    
    if LOG_FP is None:
        open_log_fp()
    
    LOG_FP.write(formatted_msg)

def notes_to_html(notes):
    plain = str(notes).replace("\n", "").replace("<", "").replace(">", "").replace("/", "").replace("\\", "")
    return f"<p>{plain}</p>"

def image_url_to_base64_string(url):
    res = requests.get(url)
    return "data:image/jpeg;base64," + base64.b64encode(res.content).decode("utf-8")

def safe_num_parse(val, dtype = "int"):
    try:
        if dtype == "float":
            return float(val)
        return int(val)
    except (ValueError, TypeError):
        return 0

def convert_time_units(v1_time_interval):
    if v1_time_interval == "day":
        return "DAY"
    if v1_time_interval == "week":
        return "WEEK"
    if v1_time_interval == "month":
        return "MONTH"
    if v1_time_interval == "year":
        return "YEAR"
    return "DAY"

def export_vehicles(db, v1_email, vehicle_id_map):
    vehicles_ref = db.collection("cars")
    query = vehicles_ref.where("userCreated", "==", v1_email).stream()

    vehicles_v2 = []
    for doc in query:
        data = doc.to_dict()
        vehicle_v2 = {
            "id": str(uuid.uuid4()),
            "name": str(data["name"]),
            "mileage": safe_num_parse(data["mileage"]),
            "year": safe_num_parse(data["year"]),
            "make": str(data["make"]),
            "model": str(data["model"]),
            "licensePlate": str(data["licensePlate"]),
            "vin": str(data["vinNumber"]),
            "notes": notes_to_html(data["notes"]),
            "dateCreated": safe_num_parse(time.time() * 1000),
            "base64Image": image_url_to_base64_string(str(data["imageUrl"]))
        }
        vehicle_id_map[data["carId"]] = vehicle_v2["id"]
        vehicles_v2.append(vehicle_v2)

    return vehicles_v2

def export_scheduled_service_types_and_instances(db, v1_email, vehicle_id_map, sst_id_map):
    ssts_ref = db.collection("scheduledServiceTypes")
    query = ssts_ref.where("userCreated", "==", v1_email).stream()

    ssts_v2 = []
    ssis_v2 = []
    for doc in query:
        data = doc.to_dict()
        sst_v2 = {
            "id": str(uuid.uuid4()),
            "name": str(data["serviceName"]),
        }
        sst_id_map[data["typeId"]] = sst_v2["id"]
        vehicles_scheduled_map = data["carsScheduled"]
        for v1_vehicle_id in vehicles_scheduled_map:
            ssi_v1 = vehicles_scheduled_map[v1_vehicle_id]
            ssi_v2 = {
                "id": str(uuid.uuid4()),
                "vehicleId": vehicle_id_map[v1_vehicle_id],
                "scheduledServiceTypeId": sst_v2["id"],
                "mileInterval": safe_num_parse(ssi_v1["miles"]),
                "timeInterval": safe_num_parse(ssi_v1["time"]["quantity"]),
                "timeUnits": convert_time_units(ssi_v1["time"]["units"])
            }
            ssis_v2.append(ssi_v2)
        ssts_v2.append(sst_v2)

    return ssts_v2, ssis_v2

def export_logs(db, v1_email, vehicle_id_map, sst_id_map, ssis_v2):
    sl_ref = db.collection("serviceLogs")
    query = sl_ref.where("userCreated", "==", v1_email).stream()

    sl_v2 = []
    rl_v2 = []

    for doc in query:
        data = doc.to_dict()

        scheduled_log = data["scheduledLog"]
        for log in scheduled_log:
            ssi_v2 = next((ssi for ssi in ssis_v2 if ssi["scheduledServiceTypeId"] == sst_id_map[log["sstRefId"]] and ssi["vehicleId"] == vehicle_id_map[log["carReferenceId"]]), None)
            if ssi_v2 is None:
                write_log(f"Could not find ssi_v2 while creating scheduled log. Not migrating log {json.dumps(log)}")
                continue
            log_v2 = {
                "id": str(uuid.uuid4()),
                "vehicleId": vehicle_id_map[log["carReferenceId"]],
                "scheduledServiceInstanceId": ssi_v2["id"],
                "datePerformed": str(log["datePerformed"]),
                "mileage": safe_num_parse(log["mileage"]),
                "laborCost": safe_num_parse(log["laborCost"], dtype="float"),
                "partsCost": safe_num_parse(log["partsCost"], dtype="float"),
                "totalCost": safe_num_parse(log["totalCost"], dtype="float"),
                "notes": notes_to_html(log["notes"])
            }
            sl_v2.append(log_v2)
        
        repair_log = data["repairLog"]
        for log in repair_log:
            log_v2 = {
                "id": str(uuid.uuid4()),
                "vehicleId": vehicle_id_map[log["carReferenceId"]],
                "name": str(log["serviceName"]),
                "datePerformed": str(log["datePerformed"]),
                "mileage": safe_num_parse(log["mileage"]),
                "laborCost": safe_num_parse(log["laborCost"], dtype="float"),
                "partsCost": safe_num_parse(log["partsCost"], dtype="float"),
                "totalCost": safe_num_parse(log["totalCost"], dtype="float"),
                "notes": notes_to_html(log["notes"])
            }
            rl_v2.append(log_v2)

    return sl_v2, rl_v2

def main():
    if len(sys.argv) != 2:
        print("Usage: python %s.py <autohub v1 email>" % sys.argv[0])
        exit(0)

    try:
        v1_email = sys.argv[1]

        open_log_fp()

        cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
        db = firestore.client()

        v1_to_v2_vehicle_id_map = {}
        v1_to_v2_sst_id_map = {}

        vehicles_v2 = export_vehicles(db, v1_email, v1_to_v2_vehicle_id_map)
        ssts_v2, ssis_v2 = export_scheduled_service_types_and_instances(db, v1_email, v1_to_v2_vehicle_id_map, v1_to_v2_sst_id_map)
        sl_v2, rl_v2 = export_logs(db, v1_email, v1_to_v2_vehicle_id_map, v1_to_v2_sst_id_map, ssis_v2)

        write_log(f"Num vehicles: {len(vehicles_v2)}")
        write_log(f"Num scheduled service types: {len(ssts_v2)}")
        write_log(f"Num scheduled service instances: {len(ssis_v2)}")
        write_log(f"Num scheduled logs: {len(sl_v2)}")
        write_log(f"Num repair logs: {len(rl_v2)}")

        output_data = {
            "vehicles": vehicles_v2,
            "scheduledServiceTypes": ssts_v2,
            "scheduledServiceInstances": ssis_v2,
            "scheduledLogs": sl_v2,
            "repairLogs": rl_v2
        }
        with open(EXPORT_FILENAME, "w") as output_f:
            json.dump(output_data, output_f, indent=4)
            write_log(f"Wrote output data to {EXPORT_FILENAME}")
    except Exception as e:
        write_log(f"ERROR: {traceback.format_exc()}")
    finally:
        write_log("Exiting...")
        close_log_fp()


if __name__ == "__main__":
    main()
