import axios from 'axios';

const fetcher = async ({ queryKey }: { queryKey: string }) => {
  const response = await axios.get(`http://localhost:3095${queryKey}`, {
    withCredentials: true,
  });

  return response.data;
}

export default fetcher;
