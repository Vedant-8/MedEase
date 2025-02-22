import React, { useEffect, useState } from "react";
import { getRelatedPersonData } from "../../api/relatedPersonApi";

interface Telecom {
  Use: string;
  Value: string;
  System: string;
}

interface RelatedPersonData {
  "Full URL": string;
  ID: string;
  "Last Updated": string;
  Name: string;
  Address: string;
  Telecom: Telecom[];
  Relationship: string;
}

const RelatedPersonTestingApi: React.FC = () => {
  const [relatedPersons, setRelatedPersons] = useState<RelatedPersonData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPersonData = async () => {
      const patientId = "01943bc1-fd38-7c9c-9947-14f7458a7428";
      const webhookType = "RelatedPerson";
      try {
        console.debug(`[RelatedPersonTestingApi] Fetching related person data for patient ${patientId}`);
        const response = await getRelatedPersonData(patientId, webhookType);
        console.debug(`[RelatedPersonTestingApi] Received related person data:`, response);
        setRelatedPersons(response);
      } catch (err) {
        console.error(`[RelatedPersonTestingApi] Error occurred:`, err);
        setError("Failed to fetch related person data");
      }
    };

    fetchRelatedPersonData();
  }, []);

  return (
    <div>
      <h1>Test Related Person API</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {relatedPersons ? (
        <div>
          {relatedPersons.map((person, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {person.Name}</p>
              <p><strong>Relationship:</strong> {person.Relationship}</p>
              <p><strong>Address:</strong> {person.Address || "Not available"}</p>
              <div>
                <strong>Telecom:</strong>
                <ul>
                  {person.Telecom.map((telecom, idx) => (
                    <li key={idx}>
                      {telecom.Use}: {telecom.Value} ({telecom.System})
                    </li>
                  ))}
                </ul>
              </div>
              <p><strong>Last Updated:</strong> {new Date(person["Last Updated"]).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RelatedPersonTestingApi;
