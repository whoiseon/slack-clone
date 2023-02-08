import axios from 'axios';

const fetcher = async ({ queryKey }: { queryKey: string }) => {
  const response = await axios.get(queryKey, {
    withCredentials: true,
  });

  return response.data;
}

export const fetcherPostChat = async ({ queryKey, data }: { queryKey: string, data: { content: string } }) => {
  const response = await axios.post(queryKey, data, {
    withCredentials: true,
  });

  return response.data;
}

export default fetcher;
