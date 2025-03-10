import { useState } from "react";
import axios from "axios";

export default function CPTracker() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [platform, setPlatform] = useState("github");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    
    if (!username){ return;}
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/${platform}/${username}`);
      setData(response.data);
    } catch (error) {
      setData({ error: "Failed to fetch data" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Coding Platform Tracker - Codemetrics </h1>
      <img src="https://assets.dio.me/eeOoAKPXmFG2iltYHFwK3ZxNfRT4_EWM2bFZ-UhxC_c/f:webp/q:80/L2FydGljbGVzL2NvdmVyL2QxODUyZWZjLWIxYmUtNGI1YS04NDEyLTY4NTZlY2QwYTYxOC5wbmc" alt="Git Logo" width="100">
     </img>
     <img src="https://miro.medium.com/v2/resize:fit:1200/1*iPZ00kImJY8oVioV5Dy75A.jpeg" alt="codeforce logo" width="100">
      </img>
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Codechef%28new%29_logo.svg/1200px-Codechef%28new%29_logo.svg.png" alt="cc logo" width="100"></img>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="codeforces">Codeforces</option>
          <option value="codechef">CodeChef</option>
          <option value="github">GitHub</option>
        </select>
        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Fetch Data
        </button>
      </div>
      {loading && <p className="text-yellow-400">Loading...</p>}
      {data && (
        <div className="mt-4 bg-gray-800 p-4 rounded w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <pre className="overflow-auto bg-gray-900 p-2 rounded text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
