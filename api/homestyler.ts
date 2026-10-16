/**
 * Homestyler Serverless API
 * Connects to live data.gov.sg and onemap.gov.sg endpoints.
 * 
 * Live Dataset Links:
 * 1a) Singaporean Register of Architects, BOA (Board of Architects):
 *     https://developers.data.gov.sg/datasets/d_d77de0f78ca589a5c61da7a60fdee6ba/view
 * 1b) Listing of Registered Contractors:
 *     https://data.gov.sg/datasets/d_dcda79be4aded5f9e769b8e23ff69b47/view
 * 1c) Listing of Licensed Builders:
 *     https://data.gov.sg/datasets/d_19573c579879be15623f2e1e3854926d/view
 * 2) OneMap Singapore Search:
 *     https://www.onemap.gov.sg/api/common/elastic/search
 */

export interface DatasetMetadata {
  id: string;
  name: string;
  agency: string;
  liveViewUrl: string;
  description: string;
}

export const DATASET_REPOSITORIES: Record<string, DatasetMetadata> = {
  boaArchitects: {
    id: 'd_d77de0f78ca589a5c61da7a60fdee6ba',
    name: 'Singaporean Register of Architects (BOA)',
    agency: 'Board of Architects (BOA)',
    liveViewUrl: 'https://developers.data.gov.sg/datasets/d_d77de0f78ca589a5c61da7a60fdee6ba/view',
    description: 'Listing of architects currently with a practicing certificate for a given year in Singapore under the Board of Architects, including local and foreign practitioners.',
  },
  registeredContractors: {
    id: 'd_dcda79be4aded5f9e769b8e23ff69b47',
    name: 'Listing of Registered Contractors',
    agency: 'Building and Construction Authority (BCA)',
    liveViewUrl: 'https://data.gov.sg/datasets/d_dcda79be4aded5f9e769b8e23ff69b47/view',
    description: 'Listing of contractors registered under BCA Contractors Registration System (CRS) including CR06 (Interior Decoration), ME01 (Air-con), ME05 (Electrical), and ME06 (Plumbing).',
  },
  licensedBuilders: {
    id: 'd_19573c579879be15623f2e1e3854926d',
    name: 'Listing of Licensed Builders',
    agency: 'Building and Construction Authority (BCA)',
    liveViewUrl: 'https://data.gov.sg/datasets/d_19573c579879be15623f2e1e3854926d/view',
    description: 'Listing of licensed builders under the Building Control Act, covering General Builder Class 1 & 2 (GB1/GB2) and Specialist Builders (SB).',
  },
  oneMapSearch: {
    id: 'onemap-elastic-search',
    name: 'OneMap Singapore Address Search',
    agency: 'Singapore Land Authority (SLA)',
    liveViewUrl: 'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1',
    description: 'SLA official OneMap geolocation & address search service with coordinates, building names, and postal details.',
  },
};

// In-memory cache for downloaded datasets (TTL: 15 minutes)
const cache: {
  [datasetId: string]: {
    data: any[];
    timestamp: number;
  };
} = {};

const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Robust CSV parser that handles quoted strings and internal commas
 */
function parseCSV(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const records: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h.trim()] = values[idx]?.trim() || '';
      });
      records.push(obj);
    }
  }

  return records;
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Fetch dataset from data.gov.sg v1/v2 polling API without hardcoding keys
 */
export async function fetchDataGovSgDataset(datasetId: string): Promise<any[]> {
  const now = Date.now();
  if (cache[datasetId] && now - cache[datasetId].timestamp < CACHE_TTL_MS) {
    return cache[datasetId].data;
  }

  const apiKey = process.env.DATA_GOV_SG_API_KEY || process.env.DATA_GOV_API_KEY;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const pollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;
  const pollResponse = await fetch(pollUrl, { headers });

  if (!pollResponse.ok) {
    throw new Error(`Failed to poll data.gov.sg dataset ${datasetId}: ${pollResponse.statusText}`);
  }

  const pollJson = await pollResponse.json();
  const downloadUrl = pollJson?.data?.url;

  if (!downloadUrl) {
    throw new Error(`No download URL returned from data.gov.sg for dataset ${datasetId}`);
  }

  const csvResponse = await fetch(downloadUrl);
  if (!csvResponse.ok) {
    throw new Error(`Failed to download dataset CSV from storage: ${csvResponse.statusText}`);
  }

  const csvText = await csvResponse.text();
  const records = parseCSV(csvText);

  cache[datasetId] = {
    data: records,
    timestamp: now,
  };

  return records;
}

/**
 * Fetch OneMap Singapore Geocoding & Address search
 */
export async function searchOneMap(
  searchVal: string,
  returnGeom: 'Y' | 'N' = 'Y',
  getAddrDetails: 'Y' | 'N' = 'Y',
  pageNum: number = 1
): Promise<any> {
  const apiKey = process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
    searchVal
  )}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`OneMap API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Serverless / Express handler
 */
export default async function handler(req: any, res: any) {
  try {
    // Extract query parameters from URL or req.query
    const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
    const query = req.query || Object.fromEntries(url.searchParams.entries());

    // Path or action determination
    const subpath = req.params?.subpath || '';
    const action = query.action || subpath || 'datasets';

    if (action === 'datasets') {
      const responseData = {
        service: 'Homestyler Public Data & Geolocation Gateway',
        timestamp: new Date().toISOString(),
        datasets: DATASET_REPOSITORIES,
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(responseData);
      }
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1a) Singaporean Register of Architects, BOA (Board of Architects)
    if (action === 'architects') {
      const q = (query.q || query.search || '').toLowerCase().trim();
      const page = Math.max(1, parseInt(query.page || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

      const allRecords = await fetchDataGovSgDataset(DATASET_REPOSITORIES.boaArchitects.id);

      const filtered = q
        ? allRecords.filter(
            (r) =>
              r.name?.toLowerCase().includes(q) ||
              r.reg_no?.toLowerCase().includes(q) ||
              r.firm_name?.toLowerCase().includes(q) ||
              r.firm_address?.toLowerCase().includes(q)
          )
        : allRecords;

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const results = filtered.slice(startIndex, startIndex + limit);

      const payload = {
        dataset: DATASET_REPOSITORIES.boaArchitects,
        query: q,
        page,
        limit,
        total,
        totalPages,
        results,
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1b) Listing of Registered Contractors (BCA)
    if (action === 'contractors') {
      const q = (query.q || query.search || '').toLowerCase().trim();
      const workhead = (query.workhead || '').toUpperCase().trim();
      const page = Math.max(1, parseInt(query.page || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

      const allRecords = await fetchDataGovSgDataset(DATASET_REPOSITORIES.registeredContractors.id);

      const filtered = allRecords.filter((r) => {
        const matchesQuery =
          !q ||
          r.company_name?.toLowerCase().includes(q) ||
          r.uen_no?.toLowerCase().includes(q) ||
          r.street_name?.toLowerCase().includes(q) ||
          r.building_name?.toLowerCase().includes(q) ||
          r.postal_code?.includes(q);

        const matchesWorkhead = !workhead || r.workhead?.toUpperCase() === workhead;
        return matchesQuery && matchesWorkhead;
      });

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const results = filtered.slice(startIndex, startIndex + limit);

      const payload = {
        dataset: DATASET_REPOSITORIES.registeredContractors,
        query: q,
        workhead: workhead || 'ALL',
        page,
        limit,
        total,
        totalPages,
        results,
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1c) Listing of Licensed Builders (BCA)
    if (action === 'builders') {
      const q = (query.q || query.search || '').toLowerCase().trim();
      const classCode = (query.classCode || '').toUpperCase().trim();
      const page = Math.max(1, parseInt(query.page || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));

      const allRecords = await fetchDataGovSgDataset(DATASET_REPOSITORIES.licensedBuilders.id);

      const filtered = allRecords.filter((r) => {
        const matchesQuery =
          !q ||
          r.company_name?.toLowerCase().includes(q) ||
          r.uen_no?.toLowerCase().includes(q) ||
          r.class?.toLowerCase().includes(q) ||
          r.street_name?.toLowerCase().includes(q) ||
          r.postal_code?.includes(q);

        const matchesClass = !classCode || r.class_code?.toUpperCase() === classCode;
        return matchesQuery && matchesClass;
      });

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const results = filtered.slice(startIndex, startIndex + limit);

      const payload = {
        dataset: DATASET_REPOSITORIES.licensedBuilders,
        query: q,
        classCode: classCode || 'ALL',
        page,
        limit,
        total,
        totalPages,
        results,
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2) OneMap Singapore Search
    if (action === 'onemap') {
      const searchVal = query.searchVal || query.q || '178903';
      const pageNum = parseInt(query.pageNum || '1', 10) || 1;
      const returnGeom = query.returnGeom === 'N' ? 'N' : 'Y';
      const getAddrDetails = query.getAddrDetails === 'N' ? 'N' : 'Y';

      const data = await searchOneMap(searchVal, returnGeom, getAddrDetails, pageNum);

      const payload = {
        dataset: DATASET_REPOSITORIES.oneMapSearch,
        searchVal,
        pageNum,
        data,
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Unknown action fallback
    const errPayload = {
      error: `Unknown action "${action}". Supported actions: architects, contractors, builders, onemap, datasets`,
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errorPayload = {
      error: 'Homestyler serverless endpoint error',
      message: error?.message || String(error),
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
