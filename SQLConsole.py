import requests
import json
o = open("./client/config.json", 'r')
api_url = json.loads(o.read())["api_url"] + "sql"
get_or_run = input("get (g) or run (r): ")
if get_or_run == "r":
    get_or_run = "run"
else:
    get_or_run = "get"

while True:
    sql = input("~ ")
    out = requests.post(api_url, json={"sql": sql, "get": get_or_run})
    try:
        print(json.dumps(json.loads(out.text), indent=2, sort_keys=True))
    except json.JSONDecodeError:
        print(out.text)