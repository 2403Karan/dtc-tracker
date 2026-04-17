from model import VehicleLocation,Agency,FareAttributes,FareRules,StopsTimes,Stops,Calender,Trips,Routes,declarative_base as db
from sqlalchemy import delete, select, join, text
from flask import Flask, request, jsonify
from sqlalchemy import func, desc, and_, between
from sqlalchemy import (BigInteger, Column, Date, Float, Integer, String, TIMESTAMP,
                        DateTime, create_engine, exc, Numeric, delete)
from google.transit import gtfs_realtime_pb2
import requests
import datetime
import os
import json
from sqlalchemy.dialects.mysql import insert
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import pymysql
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import requests
import pymysql
import logging
import os ,dotenv

dotenv.load_dotenv()
pymysql.install_as_MySQLdb()

# Database connection
connectionString = 'mysql+pymysql://%s:%s@%s/%s' % (os.getenv('DB_USERNAME'), os.getenv('DB_PASSWORD'), '127.0.0.1', 'DTC')
engine = create_engine(connectionString, isolation_level="READ UNCOMMITTED", pool_recycle=3600)
DBsession = sessionmaker(bind=engine)
session = DBsession()
  
logger = logging.getLogger(__name__)
logging.basicConfig(
    filename=r'C://projects/dtcTracker/server/rt_vehicle_location.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    force=True
)

def importRealTimeData():
    try:
        logger.info("Data fetched successfully.")
        feed = gtfs_realtime_pb2.FeedMessage()
        response = requests.get(f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={os.getenv('GTFS_REALTIME_KEY')}")
        print(response)
        if response.status_code == 200:
            feed.ParseFromString(response.content)
            data = []

            for entity in feed.entity:
                if entity.HasField("vehicle"):
                    vehicle = entity.vehicle

                    start_date = datetime.strptime(vehicle.trip.start_date, "%Y%m%d").date()
                    start_time = datetime.strptime(vehicle.trip.start_time, "%H:%M:%S").time()
                    start_datetime = datetime.combine(start_date, start_time)

                    data.append({
                        "vehicle_id": vehicle.vehicle.id,
                        "trip_id": vehicle.trip.trip_id,
                        "route_id": vehicle.trip.route_id,
                        "latitude": vehicle.position.latitude,
                        "longitude": vehicle.position.longitude,
                        "start_datetime": start_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                        "timestamps": vehicle.timestamp  
                    })
            logger.info(f"Total records fetched: {len(data)}")
            
            with engine.connect() as conn:
                stmt=session.query(VehicleLocation.trip_id,func.max(VehicleLocation.start_datetime))\
                .group_by(VehicleLocation.trip_id).all()
                tripStartDateMappings={trip_id:latest_start_datetime.strftime('%Y-%m-%d %H:%M:%S') for trip_id, latest_start_datetime in stmt }
                logger.info(f"Total tripStartDateMapping records: {len(tripStartDateMappings)}")
                filtered_data=[]
                for row in data:
                    if row['trip_id'] in tripStartDateMappings and row['start_datetime']>tripStartDateMappings[str(row['trip_id'])]:
                        filtered_data.append(row)
                logger.info(f"Total Filtered records: {len(filtered_data)}")
                result = session.query(Trips.trip_id).all()
                tripsSet = {row[0] for row in result}
                valid_data = [record for record in filtered_data if record["trip_id"] in tripsSet]
                logger.info(f"Filtered records to be inserted into database: {len(valid_data)}")
                if valid_data:
                    smt=insert(VehicleLocation).values(valid_data)
                    conn.execute(smt)
                    conn.commit()
                    print(f"Successfully entered {len(valid_data)} records into the database.")
                else:
                    print(("No new data to be inserted into database."))
                    logger.info("No new data to insert.")
        else:
            logger.error(f"Failed to fetch data. Status code: {response.status_code}")   
    except Exception as e:
        logger.exception(f"An error occurred: {e}")            
    

if __name__ == '__main__':
    logger.info('Started')
    importRealTimeData()
    logger.info('Finished')
    