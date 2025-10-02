from flask import Flask,request,jsonify
from flask_cors import CORS
import mysql_client
import json,requests
app=Flask('/dtc_tracker')
CORS(app)

serpapi_key = "a24e81b89b1c5221028e77a7cda227cbc60307f346f1d3385f220d66ab790997"

# get method
@app.route("/dtc_tracker/distancetime", methods=["GET"])
def get_distance_duration():
    sourceId = request.args.get("fromStopId")
    destinationId = request.args.get("toStopId")
    sourceName = mysql_client.getStopName(sourceId)
    destinationName = mysql_client.getStopName(destinationId)
    if not sourceName or not destinationName:
        return jsonify({"error": "Invalid stop ID"}), 400
    serpapi_url = (
        f"https://serpapi.com/search.json?engine=google_maps_directions"
        f"&start_addr={sourceName}&end_addr={destinationName}&api_key={serpapi_key}"
    )
    resp = requests.get(serpapi_url)
    data = resp.json()
    if "directions" in data and len(data["directions"]) > 0:
        distance = data["directions"][0]["formatted_distance"]
        duration = data["directions"][0]["formatted_duration"]
        return jsonify({"distance": distance, "duration": duration, "start_name": sourceName, "end_name": destinationName})
    return jsonify({"error": "No directions found"}), 404

# @app.route("/dtc_tracker/directions", methods=["GET"])
# def getDirections():
#     start = request.args.get("start")
#     end = request.args.get("end")
#     url = f"https://serpapi.com/search.json?engine=google_maps_directions&start_addr={start}&end_addr={end}&api_key={serpapi_key}"
#     res = requests.get(url)
#     return jsonify(res.json())

@app.route('/dtc_tracker/trip/<string:trip_id>/schedule')
def getTripSchedule(trip_id):
    result=mysql_client.get_trip_schedule(trip_id)
    return result

@app.route('/dtc_tracker/stop')
def getStopsDetails():
    name=request.args.get("stopName")
    if name is not None:
        result=mysql_client.get_stops_by_name(name)
    else:
        result=mysql_client.get_all_stops()
    return result

@app.route('/dtc_tracker/stop/<int:stop_id>/timing')
def getStopTiming(stop_id):
    page=int(request.args.get('page'))
    pageSize=int(request.args.get('pageSize'))
    result=mysql_client.get_stops_timings(page,pageSize,stop_id)
    return result

@app.route('/dtc_tracker/route')
def getRouteDetails():
    route = request.args.get("routeId")
    source = request.args.get('fromStopId')
    destination = request.args.get('toStopId')
    if source and destination:
        result = mysql_client.get_inbtw_stops(route, source, destination)
    elif source:
        result = mysql_client.calculate_possible_stops(source)
    else:
        result = {"error": "Insufficient parameters provided"}
    return result

@app.route('/dtc_tracker/fare')
def getFareDetails():
    source_id= request.args.get('from')  
    destination_id = request.args.get('to')  
    if source_id and destination_id:
        result = mysql_client.get_fare_details(source_id, destination_id)
    elif source_id:
        result=mysql_client.calculate_possible_stops(source_id)
    else:
        result = {"error": "Insufficient parameters provided"}
    return result

if __name__=="__main__":
    app.run()