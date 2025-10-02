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
from google.transit import gtfs_realtime_pb2
import requests
import pymysql
import logging
import time

pymysql.install_as_MySQLdb()

# Database connection
connectionString = 'mysql+pymysql://%s:%s@%s/%s' % ('pymsql', 'pymsql123', '127.0.0.1', 'DTC')
engine = create_engine(connectionString, isolation_level="READ UNCOMMITTED", pool_recycle=3600)
DBsession = sessionmaker(bind=engine)
session = DBsession()
  
logger = logging.getLogger(__name__)
logging.basicConfig(
    filename=r'C://projects/project1222086/DTC2025/rt_vehicle_location.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    force=True
)

def importRealTimeData():
    try:
        # Fetch real-time vehicle positions
        logger.info("Data fetched successfully.")
        feed = gtfs_realtime_pb2.FeedMessage()
        response = requests.get("https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key=Wnywij2jOl3N715nQzLAfOiBK4MdJwUe")

        if response.status_code == 200:
            feed.ParseFromString(response.content)
            data = []

            for entity in feed.entity:
                if entity.HasField("vehicle"):
                    vehicle = entity.vehicle

                # Convert start date and time
                    start_date = datetime.strptime(vehicle.trip.start_date, "%Y%m%d").date()
                    start_time = datetime.strptime(vehicle.trip.start_time, "%H:%M:%S").time()
                    start_datetime = datetime.combine(start_date, start_time)

                # Append data
                    data.append({
                        "vehicle_id": vehicle.vehicle.id,
                        "trip_id": vehicle.trip.trip_id,
                        "route_id": vehicle.trip.route_id,
                        "latitude": vehicle.position.latitude,
                        "longitude": vehicle.position.longitude,
                        "start_datetime": start_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                        "timestamps": vehicle.timestamp  # Make sure this key matches SQL column name
                    })
            logger.info(f"Total records fetched: {len(data)}")
            
            with engine.connect() as conn:
                stmt=session.query(VehicleLocation.trip_id,func.max(VehicleLocation.start_datetime))\
                .group_by(VehicleLocation.trip_id).all()
                tripStartDateMappings={trip_id:latest_start_datetime.strftime('%Y-%m-%d %H:%M:%S') for trip_id, latest_start_datetime in stmt }
                logger.info(f"Total tripStartDateMapping records: {len(tripStartDateMappings)}")
                # print(dir)
                filtered_data=[]
                for row in data:
                    if row['trip_id'] in tripStartDateMappings and row['start_datetime']>tripStartDateMappings[str(row['trip_id'])]:
                        filtered_data.append(row)
                # print(filtered_data)
                logger.info(f"Total Filtered records: {len(filtered_data)}")
                result = session.query(Trips.trip_id).all()
                tripsSet = {row[0] for row in result}
                # print(tripsSet)
                valid_data = [record for record in filtered_data if record["trip_id"] in tripsSet]
                # print(valid_data)
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

def main():
    logger.info('Started')
    importRealTimeData()
    logger.info('Finished')

if __name__ == '__main__':
    main()
    
    # try:
    #     while True:
    #         print(f"{time.strftime('%Y-%m-%d %H:%M:%S')}")
    #         main()
    #         time.sleep(600)  
    # except KeyboardInterrupt:
    #     print("\nLoop terminated by user.")
