import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await validateSession(req, res);
    // Since we're not using a database, we'll just return a success message
    // In a real application, you might want to implement some kind of in-memory user management
    res.status(200).json({ data: { email: session.user.email, message: 'User deactivation simulated' } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
