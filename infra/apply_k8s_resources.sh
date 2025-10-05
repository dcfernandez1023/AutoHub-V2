# Create the k8s config map
# Set env variables for envsubst to apply on yaml files
# Install the ngrok operator

# Export variables envsubst should see
export NGROK_DOMAIN="ngrok domain"
export NGROK_API_KEY="ngrok api key"
export NGROK_AUTHTOKEN="ngrok auth token"

# Build a single multi-doc stream and apply from stdin
{
  first=1
  while IFS= read -r -d '' f; do
    (( first )) || printf '\n---\n'
    envsubst < "$f"
    first=0
  done < <(find k8s -type f \( -name '*.yaml' -o -name '*.yml' \) -print0 | sort -z)
} | cat
# | kubectl apply -f -