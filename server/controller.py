from fastapi import APIRouter, Query, HTTPException ,FastAPI ,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
import mysql_client, httpx, os
from authentication import hash_password, verify_password, create_access_token
from dotenv import load_dotenv
load_dotenv()
security = HTTPBearer()

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
app = FastAPI()
router = APIRouter(prefix="/dtc_tracker", tags=["DTC Tracker"])

@app.get("/dashboard")
def get_dashboard_data():
    pass

@router.post("/register")
def register(form_data: RegisterRequest):
    existing_user = mysql_client.get_user(form_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = hash_password(form_data.password)
    mysql_client.create_user(form_data.username, hashed)
    return {"message": f"User {form_data.username} created successfully" }

@router.post("/login")
def login(form_data: LoginRequest):
    user = mysql_client.get_user(form_data.username)
    if not user or not verify_password(form_data.password,user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/distancetime")
async def get_distance_duration(
    fromStopId: int = Query(...),
    toStopId: int = Query(...),
    user: str = Depends(get_current_user)
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
def get_trip_schedule(trip_id: str,user: str = Depends(get_current_user)):
    return mysql_client.get_trip_schedule(trip_id)

@router.get("/stop")
def get_stops_details(stopName: str = None,user: str = Depends(get_current_user)):
    if stopName:
        return mysql_client.get_stops_by_name(stopName)
    return mysql_client.get_all_stops()

@router.get("/stop/{stop_id}/timing")
def get_stop_timing(stop_id: int,user: str = Depends(get_current_user)):
    return mysql_client.get_stops_timing(stop_id)

@router.get("/route")
def get_route_details(
    routeId: str = None,
    fromStopId: int = None,
    toStopId: int = None,
    user: str = Depends(get_current_user)
):
    if fromStopId and toStopId:
        return mysql_client.get_inbtw_stops(routeId, fromStopId, toStopId)
    elif fromStopId:
        return mysql_client.calculate_possible_stops(fromStopId)

@router.get("/fare")
def get_fare_details(
    from_id: int = Query(None, alias="from"),
    to_id: int = Query(None, alias="to"),
    user: str = Depends(get_current_user)
):
    if from_id and to_id:
        return mysql_client.get_fare_details(from_id, to_id)
    elif from_id:
        return mysql_client.calculate_possible_stops(from_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)