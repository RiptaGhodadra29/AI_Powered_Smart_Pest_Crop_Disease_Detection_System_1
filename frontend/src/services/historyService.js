import api from "./api";

export const getHistory = async (userId) => {
  const response = await api.get(`/history/${userId}`);

  return response.data;
};

export const getPredictionDetail = async (predictionId) => {
  const response = await api.get(`/history/detail/${predictionId}`);

  return response.data;
};

export const deletePrediction = async (predictionId) => {
  const response = await api.delete(`/history/${predictionId}`);

  return response.data;
};
