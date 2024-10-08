import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';


const Home = () => {
  return (
    <LandingLayout>
      <Meta
        title="NextJS SaaS Boilerplate"
        description="A boilerplate for your NextJS SaaS projects."
      />
    </LandingLayout>
  );
};

export default Home;
