# from google.maps import routing_v2

# from google.oauth2 import service_account


# def sample_compute_routes():
#     # Create a client
#     client = routing_v2.RoutesClient()

#     # Initialize request argument(s)
#     request = routing_v2.ComputeRoutesRequest(
#     )

#     # Make the request
#     response = client.compute_routes(request=request)

#     # Handle the response
#     print(response)

# from google.maps import routing_v2
# from google.maps.routing_v2 import ComputeRoutesRequest, RouteTravelMode, Location, Waypoint
# from google.api_core.exceptions import GoogleAPIError

# credentials = service_account.Credentials.from_service_account_file("C:\programs\project_1222086\DTC2025\deft-breaker-453306-e3-b154a7bf0d2d.json")
from google.maps import routing_v2
from google.maps.routing_v2 import ComputeRoutesRequest, RouteTravelMode, Location, Waypoint
from google.oauth2 import service_account
from google.api_core.exceptions import GoogleAPIError

# Authenticate using service account
credentials = service_account.Credentials.from_service_account_file(
    "C:/programs/project_1222086/DTC2025/deft-breaker-453306-e3-b154a7bf0d2d.json"
)

def sample_compute_routes():
    try:
        # Create a Routes client with credentials
        client = routing_v2.RoutesClient(credentials=credentials)

        # Define origin and destination
        origin = Waypoint(
            location=Location(lat_lng={"latitude": 28.7041, "longitude": 77.1025})  # Delhi
        )
        destination = Waypoint(
            location=Location(lat_lng={"latitude": 19.0760, "longitude": 72.8777})  # Mumbai
        )

        # Create the request
        request = ComputeRoutesRequest(
            origin=origin,
            destination=destination,
            travel_mode=RouteTravelMode.DRIVE
        )

        # Make the request
        response = client.compute_routes(request=request)

        # Handle the response
        for route in response.routes:
            distance_km = route.distance_meters / 1000
            duration_seconds = route.duration.total_seconds()
            hours, minutes = divmod(duration_seconds // 60, 60)

            print(f"Distance: {distance_km:.2f} km")
            print(f"Duration: {int(hours)} hours {int(minutes)} minutes")
            print(f"Polyline: {route.polyline.encoded_polyline}")

    except GoogleAPIError as e:
        print(f"API error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sample_compute_routes()

# def sample_compute_routes():
#     try:
#         # Create a Routes client
#         client = routing_v2.RoutesClient()

#         # Define origin and destination using latitude and longitude
#         origin = Waypoint(
#             location=Location(lat_lng={"latitude": 28.7041, "longitude": 77.1025})  # Delhi
#         )
#         destination = Waypoint(
#             location=Location(lat_lng={"latitude": 19.0760, "longitude": 72.8777})  # Mumbai
#         )

#         # Create the request with valid parameters
#         request = ComputeRoutesRequest(
#             origin=origin,
#             destination=destination,
#             travel_mode=RouteTravelMode.DRIVE  # Travel mode can be DRIVE, WALK, BICYCLE, or TRANSIT
#         )

#         # Make the request
#         response = client.compute_routes(request=request)

#         # Handle the response
#         for route in response.routes:
#             distance_km = route.distance_meters / 1000  # Convert meters to kilometers
#             duration_seconds = route.duration.seconds
#             hours, minutes = divmod(duration_seconds // 60, 60)

#             print(f"Distance: {distance_km:.2f} km")
#             print(f"Duration: {hours} hours {minutes} minutes")
#             print(f"Polyline: {route.polyline.encoded_polyline}")

#     except GoogleAPIError as e:
#         print(f"API error: {e}")
#     except Exception as e:
#         print(f"Error: {e}")

# if __name__ == "__main__":
#     sample_compute_routes()



# import  requests
# import json
# from datetime import datetime, timedelta

# # # Replace with your Google Maps API Key
# # API_KEY ="AIzaSyC3do5-AmLqOj61wCLdZKQnnw6F8CWmnR4"
# # api_key="AIzaSyC3do5-AmLqOj61wCLdZKQnnw6F8CWmnR4"

# def get_lati_longi(api_key, address):
#     url = 'https://maps.googleapis.com/maps/api/geocode/json'
#     params = {
#         "address": address,
#         "key": api_key
#     }
#     response = requests.get(url, params=params)
#     if response.status_code == 200:
#         data = response.json()
#         if data["status"] == "OK":
#             location = data["results"][0]["geometry"]["location"]
#             lat = location["lat"]
#             lng = location["lng"]
#             return lat, lng
#         else:
#             print(f"Error: {data['error_message']}")
#             return 0, 0
#     else:
#         print("Failed to make the request.")

#         return 0, 0

# def get_eta(API_KEY,origin, destination):
#     try:
#         # Google Maps Directions API endpoint
#         url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={API_KEY}"
        
#         response = requests.get(url)
#         data = response.json()
        
#         if data['status'] == 'OK':
#             # Extract duration in seconds
#             duration_seconds = data['routes'][0]['legs'][0]['duration']['value']
#             duration_text = data['routes'][0]['legs'][0]['duration']['text']
            
#             # Calculate ETA
#             eta = datetime.now() + timedelta(seconds=duration_seconds)
#             eta_formatted = eta.strftime("%Y-%m-%d %H:%M:%S")
            
#             print(f"Estimated travel time: {duration_text}")
#             print(f"Estimated time of arrival: {eta_formatted}")
#         else:
#             print(f"Error: {data['status']}")
    
#     except Exception as e:
#         print(f"An error occurred: {e}")

# def get_location_name(api_key, latitude, longitude):
#     url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={api_key}"
    
#     response = requests.get(url)
#     if response.status_code == 200:
#         data = response.json()
#         if 'results' in data and len(data['results']) > 0:
#             # Get the formatted address (location name)
#             return data['results'][0]['formatted_address']
#         else:
#             return "No location found for the given coordinates."
#     else:
#         return f"Error: {response.status_code} - {response.reason}"
    
# if __name__ == "__main__":
#     origin = input("Enter origin (e.g., 'Delhi, India'): ")
#     destination = input("Enter destination (e.g., 'Mumbai, India'): ")
#     API_KEY ="AIzaSyC3do5-AmLqOj61wCLdZKQnnw6F8CWmnR4"
#     get_eta(API_KEY,origin, destination)

# # if __name__ == "__main__":
# #     # Your Google Maps API Key
# #     API_KEY = "AIzaSyC3do5-AmLqOj61wCLdZKQnnw6F8CWmnR4"
    
# #     # Example Coordinates
# #     latitude = 30.1290   # Latitude for San Francisco
# #     longitude =  77.2674  # Longitude for San Francisco
    
# #     location = get_location_name(API_KEY, latitude, longitude)
# #     print(f"Location: {location}")


# # if __name__ == "__main__":
# #     address = 'dubai'
# #     lati, longi = get_lati_longi(api_key, address)
# #     print(f"Latitude: {lati}")
# #     print(f"Longitude: {longi}")
