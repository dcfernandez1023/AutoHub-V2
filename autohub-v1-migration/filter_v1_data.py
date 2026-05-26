import sys
import json

def transform_to_v2(vehicles, ssts, ssis, slogs, rlogs):
    return {
        "vehicles": [{k: v for k, v in d.items() if k != "userId"} for d in vehicles],
        "scheduledServiceTypes": [{k: v for k, v in d.items() if k != "userId"} for d in ssts],
        "scheduledServiceInstances": [{k: v for k, v in d.items() if k != "userId"} for d in ssis],
        "scheduledLogs": [{k: v for k, v in d.items() if k != "userId"} for d in slogs],
        "repairLogs": [{k: v for k, v in d.items() if k != "userId"} for d in rlogs],
    }

def main():
    fname = sys.argv[1]
    vehicle_id = sys.argv[2]

    with open(fname, "r") as f:
        data = json.load(f)

        vehicles = data.get("vehicles", [])
        ssts = data.get("scheduledServiceTypes", [])
        ssis = data.get("scheduledServiceInstances", [])
        slogs = data.get("scheduledLogs", [])
        rlogs = data.get("repairLogs", [])

        filtered_vehicles = [v for v in vehicles if v["id"] == vehicle_id]
        filtered_ssis = [s for s in ssis if s["vehicleId"] == vehicle_id]
        filtered_slogs = [s for s in slogs if s["vehicleId"] == vehicle_id]
        filtered_rlogs = [r for r in rlogs if r["vehicleId"] == vehicle_id]

        output_data = transform_to_v2(filtered_vehicles, ssts, filtered_ssis, filtered_slogs, filtered_rlogs)
    
    with open("filtered_data.json", "w") as f:
        json.dump(output_data, f, indent=2)


if __name__ == "__main__":
    main()