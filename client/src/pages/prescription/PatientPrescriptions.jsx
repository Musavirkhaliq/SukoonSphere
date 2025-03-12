import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiEye, FiPrinter } from "react-icons/fi";
import { useUser } from "@/context/UserContext";

const PatientPrescriptions = () => {
  const { id: patientId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(
          `prescriptions/patient/${patientId}`
        );
        setPrescriptions(data.prescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const handleView = (prescriptionId) => {
    console.log("Viewing prescription:", prescriptionId);
    // Add view functionality here
  };

  const handlePrint = (prescriptionId) => {
    console.log("Printing prescription:", prescriptionId);
    // Add print functionality here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4"> Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500">
          No prescriptions found for this patient.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-500 text-sm mb-2">
                Created: {new Date(prescription.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-end space-x-2 mt-4">
                <Link
                  to={`/view-prescription/${prescription._id}`}
                  className="flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <FiEye className="mr-1" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
