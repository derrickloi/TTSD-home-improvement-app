export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  integrations: {
    dataGovSg: {
      status: string;
      endpoints: string[];
    };
    oneMapGovSg: {
      status: string;
      endpoint: string;
      hasApiKeyConfigured: boolean;
      keyless?: boolean;
    };
  };
}

export default async function handler(req: any, res: any) {
  const hasOneMapKey = Boolean(process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN);
  const hasDataGovKey = Boolean(process.env.DATA_GOV_SG_API_KEY || process.env.DATA_GOV_API_KEY);

  const healthData: HealthStatus = {
    status: 'ok',
    service: 'Homestyler API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    integrations: {
      dataGovSg: {
        status: 'connected',
        endpoints: [
          'd_d77de0f78ca589a5c61da7a60fdee6ba (BOA Architects)',
          'd_dcda79be4aded5f9e769b8e23ff69b47 (Registered Contractors)',
          'd_19573c579879be15623f2e1e3854926d (Licensed Builders)',
        ],
      },
      oneMapGovSg: {
        status: 'connected (keyless public endpoint)',
        endpoint: 'https://www.onemap.gov.sg/api/common/elastic/search',
        hasApiKeyConfigured: hasOneMapKey,
        keyless: true,
      },
    },
  };

  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(healthData);
  }

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
