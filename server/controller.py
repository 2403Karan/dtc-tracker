from fastapi import APIRouter, Query, HTTPException ,FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql_client
import httpx, os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
router = APIRouter(prefix="/dtc_tracker", tags=["DTC Tracker"])

@router.get("/distancetime")
async def get_distance_duration(
    fromStopId: int = Query(...),
    toStopId: int = Query(...)
):
    sourceName = mysql_client.getStopName(fromStopId)
    destinationName = mysql_client.getStopName(toStopId)

    if not sourceName or not destinationName:
        raise HTTPException(status_code=400, detail="Invalid stop ID")

    serpapi_url = (
        f"https://serpapi.com/search.json?engine=google_maps_directions"
        f"&start_addr={sourceName}&end_addr={destinationName}&api_key={os.getenv('SERPAPI_KEY')}"
    )

    async with httpx.AsyncClient() as client:
        resp = await client.get(serpapi_url)
        data = resp.json()

    if "directions" in data and len(data["directions"]) > 0:
        return {
            "distance": data["directions"][0]["formatted_distance"],
            "duration": data["directions"][0]["formatted_duration"],
            "start_name": sourceName,
            "end_name": destinationName
        }

    raise HTTPException(status_code=404, detail="Route information not found")

@router.get("/trip/{trip_id}/schedule")
def get_trip_schedule(trip_id: str):
    return mysql_client.get_trip_schedule(trip_id)


@router.get("/stop")
def get_stops_details(stopName: str = None):
    if stopName:
        return mysql_client.get_stops_by_name(stopName)
    return mysql_client.get_all_stops()


@router.get("/stop/{stop_id}/timing")
def get_stop_timing(stop_id: int):
    return mysql_client.get_stops_timing(stop_id)


@router.get("/route")
def get_route_details(
    routeId: str = None,
    fromStopId: int = None,
    toStopId: int = None
):
    if fromStopId and toStopId:
        return mysql_client.get_inbtw_stops(routeId, fromStopId, toStopId)
    elif fromStopId:
        return mysql_client.calculate_possible_stops(fromStopId)


@router.get("/fare")
def get_fare_details(
    from_id: int = Query(None, alias="from"),
    to_id: int = Query(None, alias="to")
):
    if from_id and to_id:
        return mysql_client.get_fare_details(from_id, to_id)
    elif from_id:
        return mysql_client.calculate_possible_stops(from_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)