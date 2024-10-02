import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import DefaultErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Meta from '@/components/Meta';

// Replace these functions with API calls or other methods of fetching workspace data
const fetchSiteWorkspace = async (site) => {
  // Example API call (you can replace this with the actual API endpoint or method)
  const response = await fetch(`https://example.com/api/workspaces/${site}`);
  if (!response.ok) return null;
  return await response.json();
};

const fetchWorkspacePaths = async () => {
  // Example API call to get workspace paths (you can replace this with the actual API endpoint or method)
  const response = await fetch('https://example.com/api/workspaces/paths');
  if (!response.ok) return [];
  return await response.json();
};

const Site = ({ workspace }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return workspace ? (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
      <Meta title={workspace.name} />
      <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center ">
        <h1 className="text-4xl font-bold">
          Welcome to your workspace&apos;s subdomain!
        </h1>
        <h2 className="text-2xl">
          This is the workspace of <strong>{workspace.name}.</strong>
        </h2>
        <p>You can also visit these links:</p>
        <Link
          href={`https://${workspace.hostname}`}
          className="flex space-x-3 text-blue-600 hover:underline"
          target="_blank"
        >
          <span>{`${workspace.hostname}`}</span>
          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
        </Link>
        {workspace.domains.map((domain, index) => (
          <Link
            key={index}
            href={`https://${domain.name}`}
            className="flex space-x-3 text-blue-600 hover:underline"
            target="_blank"
          >
            <span>{domain.name}</span>
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </Link>
        ))}
      </div>
    </main>
  ) : (
    <>
      <Meta noIndex />
      <DefaultErrorPage statusCode={404} />
    </>
  );
};

export const getStaticPaths = async () => {
  const paths = await fetchWorkspacePaths();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { site } = params;
  const siteWorkspace = await fetchSiteWorkspace(site);
  let workspace = null;

  if (siteWorkspace) {
    const { host } = new URL(process.env.APP_URL);
    workspace = {
      domains: siteWorkspace.domains,
      name: siteWorkspace.name,
      hostname: `${siteWorkspace.slug}.${host}`,
    };
  }

  return {
    props: { workspace },
    revalidate: 10,
  };
};

export default Site;
