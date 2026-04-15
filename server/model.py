import pymysql
pymysql.install_as_MySQLdb()
from sqlalchemy import (BigInteger, Boolean, Column, Date, Float, Integer, String,TIMESTAMP,
                        DateTime, create_engine, exc, Numeric, func,ForeignKey,Table,MetaData)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship,mapped_column
from sqlalchemy import func, desc

Base = declarative_base()

meta=MetaData()
class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    
class Agency(Base):
    __tablename__ = 'agency'
    agency_id= mapped_column(String, primary_key=True)
    agency_name= mapped_column(String)
    agency_url = mapped_column(String)
    agency_timezone = mapped_column(String)  
    agency_lang= mapped_column(String)
    agency_phone = mapped_column(String)
    agency_fare_url= mapped_column(String)
    
class Routes(Base):
    __tablename__ = 'routes'
    route_id= mapped_column(Integer, primary_key=True)
    agency_id= mapped_column(String)
    route_long_name = mapped_column(String)
    route_short_name = mapped_column(String)  
    route_type= mapped_column(Integer)

class FareRules(Base):
    __tablename__ = 'fare_rules'
    fare_id= mapped_column(String, primary_key=True)
    route_id= mapped_column(Integer)
    origin_id = mapped_column(Integer)
    destination_id = mapped_column(Integer)  
    
class FareAttributes(Base):
    __tablename__ = 'fare_attributes'
    fare_id= mapped_column(String, primary_key=True)
    price= mapped_column(Integer)
    currency_type = mapped_column(String)
    payment_method = mapped_column(Integer)  
    transfer = mapped_column(Integer)
    agency_id = mapped_column(String)
    old_fare_id = mapped_column(String)

class Trips(Base):
    __tablename__ = 'trips'
    route_id = mapped_column(Integer)
    service_id= mapped_column(Integer)
    trip_id= mapped_column(String, primary_key=True)
    shape_id = mapped_column(String)  
    
class Calender(Base):
    __tablename__ = 'Calender'
    service_id= mapped_column(Integer, primary_key=True)
    start_date= mapped_column(String)
    end_date = mapped_column(String)
    monday = mapped_column(Integer)
    tuesday = mapped_column(Integer)
    wednesday = mapped_column(Integer)
    thrusday = mapped_column(Integer)
    friday = mapped_column(Integer)
    saturday= mapped_column(Integer)
    sunday = mapped_column(Integer)
    
class StopsTimes(Base):
    __tablename__ = 'stops_times'
    stop_time_id= mapped_column(Integer, primary_key=True)
    trip_id= mapped_column(String)
    arrival_time = mapped_column(DateTime)
    departure_time = mapped_column(DateTime)  
    stop_id = mapped_column(Integer)
    stop_sequence = mapped_column(Integer)

class Stops(Base):
    __tablename__ = 'stops'
    stop_code= mapped_column(String)
    stop_id= mapped_column(Integer,primary_key=True)
    stop_lat = mapped_column(Numeric(precision=18,scale=15))
    stop_long = mapped_column(Numeric(precision=18,scale=15))  
    stop_name= mapped_column(String)
    zone_id = mapped_column(Integer)

class VehicleLocation(Base):
    __tablename__ = 'vehicle_location'
    vehicle_id= mapped_column(String, primary_key=True)
    trip_id = mapped_column(String)
    route_id = mapped_column(Integer)
    latitude = mapped_column(Numeric(precision=18,scale=15))  
    longitude= mapped_column(Numeric(precision=18,scale=15))
    start_datetime = mapped_column(DateTime)
    timestamps= mapped_column(TIMESTAMP)