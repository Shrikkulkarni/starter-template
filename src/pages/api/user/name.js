import {
  validateUpdateName,
  validateSession,
} from '@/config/api-validation/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    await validateUpdateName(req, res);
    const { name } = req.body;
    
    // Since we're not using a database, we'll just return a success message
    // In a real application, you might want to implement some kind of in-memory user management
    res.status(200).json({ data: { name, message: 'Name update simulated' } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
