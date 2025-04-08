import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { useToast } from "@/hooks/use-toast";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await bookingService.getBooking(bookingId);
        setBooking(response);
      } catch (err) {
        setError('Failed to fetch booking details. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to fetch booking details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, toast]);

  const handleBackToDashboard = () => {
    navigate('/user-dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FaTimesCircle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isPaymentSuccessful = booking?.status === 'paid' || booking?.payment_status === 'paid' || 
                             (booking?.message && booking?.message.includes('paid'));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {isPaymentSuccessful ? (
          <div className="text-center">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue with your payment. Please try again or contact support.
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Details</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Booking ID:</span> {booking?.id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span> {new Date(booking?.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Time:</span> {booking?.time}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span>{' '}
              <span className={`font-medium ${isPaymentSuccessful ? 'text-green-500' : 'text-red-500'}`}>
                {booking?.status}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleBackToDashboard}
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 