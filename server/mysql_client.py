from model import FareAttributes,FareRules,StopsTimes,Stops,Calender,Trips,Routes
from sqlalchemy import select, join, text , func, and_, distinct,create_engine
from sqlalchemy.orm import sessionmaker,aliased
import datetime,pymysql, os
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()  
pymysql.install_as_MySQLdb()

connectionString = 'mysql://%s:%s@%s/%s' % (os.getenv('DB_USERNAME'), os.getenv('DB_PASSWORD'), '127.0.0.1:3306', 'dtc')
Base = declarative_base()
engine = create_engine(connectionString, isolation_level="READ UNCOMMITTED", pool_recycle=3600)
Base.metadata.bind = engine
Base.metadata.create_all(engine)
DBsession = sessionmaker(bind=engine)
session = DBsession()

def getStopName(id):
    stmt=select(Stops.stop_name).where(Stops.stop_id==id)
    with engine.connect() as con:
        result=con.execute(stmt).fetchone()
    if result:
        return result[0]
    else:
        return "No Stop Name Found"

def convert_timedelta(td):
    """Convert timedelta to HH:MM:SS format"""
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    return f"{hours:02}:{minutes:02}"

def StopsTimeDetailsJson(records):
    obj_arr=[]
    for row in records:
        data= {
            'trip_id': row[0],
            'route_name': row[1],
            'arrival_time':convert_timedelta(row[2])
        }
        obj_arr.append(data)
    return obj_arr

def stopNameInJson(result):
    obj_arr=[]
    for row in result:
        data= {
            'stop_code':row[0],
            'stop_id':row[1],
            'stop_name': row[2],
            'latitude': float(row[3]),
            'longitude':float(row[4]),
            'zone_id':int(row[5])
        }
        obj_arr.append(data)
    return obj_arr

def calculatedStopName(result):
    obj_arr=[]
    for row in result:
        data= {
            'stop_name': row[0],
            'stop_id':row[1]
            }
        obj_arr.append(data)
    return obj_arr

def routeNameInJson(result):
    obj_arr=[]
    for row in result:
        data= {
            'route_name': row[0],
            'agency_name':row[1]
        }
        obj_arr.append(data)
    return obj_arr

def inBtwStopsDetailsJson(records):
    obj_arr=[]
    for row in records:
        data= {
            'stop_name': row[0],
            'arrival_time': convert_timedelta(row[1]),
            'departure_time':convert_timedelta(row[2]),
            "latitude": float(row[3]),
            "longitude": float(row[4])  
        }
        obj_arr.append(data)
    return obj_arr

def tripDetailsJson(records):
    obj_arr=[]
    for row in records:
        data= {
            'stop_name': row[0],
            'arrival_time': convert_timedelta(row[1]),
            'departure_time':convert_timedelta(row[2])
        }
        obj_arr.append(data)
    return obj_arr

def fareDetailsJson(records):
    obj_arr=[]
    for row in records:
        data= {
            'price': row[0],
            'currency_type': row[1],
            'route_name':row[2],
            'route_id':row[3]
        }
        obj_arr.append(data)
    return obj_arr

def get_trip_schedule(tripId):
    join_stmt=join(StopsTimes,Stops,StopsTimes.stop_id==Stops.stop_id)
    stmt=select(Stops.stop_name,StopsTimes.arrival_time,StopsTimes.departure_time).select_from(join_stmt)\
        .where(StopsTimes.trip_id==tripId).order_by(StopsTimes.arrival_time)
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return tripDetailsJson(result)

def get_fare_details(source, destination):
    s1 = aliased(Stops, name="s1")  
    s2 = aliased(Stops, name="s2")  
    st1 = aliased(StopsTimes, name="st1")  
    st2 = aliased(StopsTimes, name="st2")  
    join_stmt = (
        join(FareRules, FareAttributes, FareRules.fare_id == FareAttributes.fare_id)
        .join(Routes, Routes.route_id == FareRules.route_id)
        .join(Trips, Trips.route_id == Routes.route_id)
        .join(st1, st1.trip_id == Trips.trip_id)
        .join(s1, s1.stop_id == st1.stop_id)
        .join(st2, st2.trip_id == Trips.trip_id)
        .join(s2, s2.stop_id == st2.stop_id)
    )
    stmt = (
        select(
            FareAttributes.price,
            FareAttributes.currency_type,
            Routes.route_long_name,
            Routes.route_id
        )
        .select_from(join_stmt)
        .where(
            and_(
                s1.stop_id == source,
                s2.stop_id == destination,
                st1.arrival_time > func.now(),       
                st2.stop_sequence > st1.stop_sequence  
            )
        )
        .distinct(Routes.route_long_name)
        .order_by(FareAttributes.price) 
    )
    with engine.connect() as con:
        result = con.execute(stmt).fetchall()
    return fareDetailsJson(result)
    
def get_stops_timings(page,page_size,stopid):
    join_stmt=join(StopsTimes,Trips,StopsTimes.trip_id==Trips.trip_id)\
        .join(Routes,Routes.route_id==Trips.route_id)
    stmt=select(Trips.trip_id,Routes.route_long_name,StopsTimes.arrival_time).select_from(join_stmt)\
        .where(and_(StopsTimes.stop_id==stopid,StopsTimes.arrival_time>func.now())).order_by(StopsTimes.arrival_time)\
        .offset((page - 1) * page_size).limit(page_size)
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return StopsTimeDetailsJson(result)

def get_stops_timing(stopid):
    join_stmt=join(StopsTimes,Trips,StopsTimes.trip_id==Trips.trip_id)\
        .join(Routes,Routes.route_id==Trips.route_id)
    stmt=select(Trips.trip_id,Routes.route_long_name,StopsTimes.arrival_time).select_from(join_stmt)\
        .where(and_(StopsTimes.stop_id==stopid,StopsTimes.arrival_time>func.now(),
                    StopsTimes.arrival_time <= func.date_add(func.now(), text("INTERVAL 1 HOUR"))))\
        .order_by(StopsTimes.arrival_time)
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return StopsTimeDetailsJson(result)
    
def get_inbtw_stops(route_id, source_id, destination_id):
    now = datetime.now().time()
    st1 = aliased(StopsTimes)
    st2 = aliased(StopsTimes)
    s1 = aliased(Stops)
    s2 = aliased(Stops)
    tripId = (
        select(Trips.trip_id)
        .join(StopsTimes, Trips.trip_id == StopsTimes.trip_id)
        .where(
            and_(
                Trips.route_id == route_id,
                StopsTimes.stop_sequence == 1,
                StopsTimes.arrival_time > now 
            )
        )
        .order_by(StopsTimes.arrival_time)
        .limit(1)
    ).scalar_subquery()
    
    sourceSeq= (
        select(st1.stop_sequence)
        .join(s1, s1.stop_id == st1.stop_id)
        .where(
            and_(
                st1.trip_id == tripId,
                s1.stop_id == source_id
            )
        )
        .limit(1)
    ).scalar_subquery()

    destSeq= (
        select(st2.stop_sequence)
        .join(s2, s2.stop_id == st2.stop_id)
        .where(
            and_(
                st2.trip_id == tripId,
                s2.stop_id == destination_id
            )
        )
        .limit(1)
    ).scalar_subquery()

    stmt = (
        select(
            Stops.stop_name,
            StopsTimes.arrival_time,
            StopsTimes.departure_time,
            Stops.stop_lat,
            Stops.stop_long
        )
        .join(Stops, Stops.stop_id == StopsTimes.stop_id)
        .where(
            and_(
                StopsTimes.trip_id == tripId,
                StopsTimes.stop_sequence.between(sourceSeq,destSeq)
            )
        )
        .order_by(StopsTimes.stop_sequence)
    )
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return inBtwStopsDetailsJson(result)

def calculate_possible_stops(source):
    s1 = aliased(Stops)
    s2 = aliased(Stops)
    st1 = aliased(StopsTimes)
    st2 = aliased(StopsTimes)
    t = aliased(Trips)
        
    join_stmt = join(s1, st1, s1.stop_id == st1.stop_id) \
        .join(t, st1.trip_id == t.trip_id) \
        .join(st2, t.trip_id == st2.trip_id) \
        .join(s2, st2.stop_id == s2.stop_id)
        
    stmt = (
        select(distinct(s2.stop_name),s2.stop_id)
        .select_from(join_stmt)
        .where(s1.stop_id == source)
    ) 
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return calculatedStopName(result)
    
def get_stops_by_name(stopName):
    stmt= (
            select(Stops.stop_code,Stops.stop_id,Stops.stop_name, Stops.stop_lat, Stops.stop_long, Stops.zone_id)
            .where(Stops.stop_name.like(f'{stopName}%'))  
        )
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return stopNameInJson(result)

def get_all_stops():
    stmt=(select(Stops.stop_code,Stops.stop_name, Stops.stop_lat, Stops.stop_long, Stops.zone_id)
          .order_by(Stops.stop_name))
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return stopNameInJson(result)

def get_route_by_name(routeName):
    stmt= (
            select(Routes.route_long_name,Routes.agency_id)
            .where(Routes.route_long_name.like(f'{routeName}%'))  # Case-insensitive partial match
        )
    with engine.connect() as con:
        result=con.execute(stmt).fetchall()
    return routeNameInJson(result)

 
def get_stop_name():
    s1 = aliased(Stops)
    st1 = aliased(StopsTimes)
    t1 = aliased(Trips)
    s2 = aliased(Stops) 
    st2 = aliased(StopsTimes)
    t2 = aliased(Trips)

    subq_lower = (
    select(st1.stop_sequence)
    .join(s1, st1.stop_id == s1.stop_id)
    .join(t1, st1.trip_id == t1.trip_id)
    .where(
        s1.stop_name == 'Karala Pathsala Jain Mandir',
        t1.trip_id == StopsTimes.trip_id
    )
    .correlate(StopsTimes)
    .scalar_subquery()
    )

    subq_upper = (
    select(st2.stop_sequence)
    .join(s2, st2.stop_id == s2.stop_id)
    .join(t2, st2.trip_id == t2.trip_id)
    .where(
        s2.stop_name == 'Karala Crossing',
        t2.trip_id == StopsTimes.trip_id
    )
    .correlate(StopsTimes)
    .scalar_subquery()
    )

    query = (
    session.query(
        distinct(Stops.stop_name),
        StopsTimes.arrival_time
    )
    .join(StopsTimes, Stops.stop_id == StopsTimes.stop_id)
    .join(Trips, StopsTimes.trip_id == Trips.trip_id)
    .join(Routes, Trips.route_id == Routes.route_id)
    .filter(
        Routes.route_long_name == '962UP',
        StopsTimes.arrival_time > func.current_time(),
        StopsTimes.stop_sequence.between(subq_lower, subq_upper)
    ).limit(count_stop_name())
    )
    
    print(query)
    result=query.all()
    return result

def count_stop_name(): # calculate total stops between two stops
    s1 = aliased(Stops)
    st1 = aliased(StopsTimes)
    t1 = aliased(Trips)
    s2 = aliased(Stops) 
    st2 = aliased(StopsTimes)
    t2 = aliased(Trips)

    subq_lower = (
    select(st1.stop_sequence)
    .join(s1, st1.stop_id == s1.stop_id)
    .join(t1, st1.trip_id == t1.trip_id)
    .where(
        s1.stop_name == 'Karala Pathsala Jain Mandir',
        t1.trip_id == StopsTimes.trip_id
    )
    .correlate(StopsTimes)
    .scalar_subquery()
    )

    subq_upper = (
    select(st2.stop_sequence)
    .join(s2, st2.stop_id == s2.stop_id)
    .join(t2, st2.trip_id == t2.trip_id)
    .where(
        s2.stop_name == 'Karala Crossing',
        t2.trip_id == StopsTimes.trip_id
    )
    .correlate(StopsTimes)
    .scalar_subquery()
    )
    query = (
    session.query(
        func.count(distinct(Stops.stop_name))
    )
    .join(StopsTimes, Stops.stop_id == StopsTimes.stop_id)
    .join(Trips, StopsTimes.trip_id == Trips.trip_id)
    .join(Routes, Trips.route_id == Routes.route_id)
    .filter(
        Routes.route_long_name == '962UP',
        StopsTimes.arrival_time > func.current_time(),
        StopsTimes.stop_sequence.between(subq_lower, subq_upper)
    )
    )
    result=query.scalar()
    return result