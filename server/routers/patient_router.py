from fastapi import APIRouter,HTTPException
import os
import requests
import json

x_api_key=os.environ["metri_port_api_key"]
router= APIRouter()

#creates a patient on Metripoint dashboard
@router.post('/createPatient')
def create_patient(payload: json, query: json):
    url = "https://api.sandbox.metriport.com/medical/v1/patient"
    
    headers = {
        "x-api-key": x_api_key,
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, params=query.dict(), json=payload.dict(), headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses

        return {"status": response.status_code, "data": response.json()}  # Return the status and response data

    except requests.exceptions.HTTPError as http_err:
        raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {http_err}")

    except requests.exceptions.RequestException as err:
        raise HTTPException(status_code=500, detail=f"Request error: {err}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    

#get patient data from Metripoint dashboard
@router.get('/getpatient')
def get_patient(id: str):
    url = f"https://api.sandbox.metriport.com/medical/v1/patient/{id}"
    headers = {"x-api-key": x_api_key}

    try:
        response = requests.get(url, headers=headers)  # Use requests.get for clarity
        response.raise_for_status()  # Raises an HTTPError for bad responses

        patient_data = response.json()  # Directly parse JSON from response
        return {"patientData": patient_data}

    except requests.exceptions.HTTPError as http_err:
        # Handle HTTP errors
        return {"error": f"HTTP error occurred: {http_err}"}

    except requests.exceptions.RequestException as err:
        # Handle other request-related errors
        return {"error": f"Error occurred: {err}"}

    except Exception as e:
        # Catch any other exceptions
        return {"error": f"An unexpected error occurred: {e}"}


#update patient data from metripoint dashboard
@router.put('/update_patient')
def updatePatient(payload: json, query: json):
    url = "https://api.sandbox.metriport.com/medical/v1/patient"
    
    headers = {
        "x-api-key": x_api_key,
        "Content-Type": "application/json"
    }

    try:
        response = requests.put(url, params=query, json=payload, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses

        return {"status": response.status_code, "data": response.json()}  # Return the status and response data

    except requests.exceptions.HTTPError as http_err:
        raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {http_err}")

    except requests.exceptions.RequestException as err:
        raise HTTPException(status_code=500, detail=f"Request error: {err}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    

