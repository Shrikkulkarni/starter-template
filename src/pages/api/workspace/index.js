import slugify from 'slugify';

import {
  validateCreateWorkspace,
  validateSession,
} from '@/config/api-validation/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await validateSession(req, res);
    await validateCreateWorkspace(req, res);
    const { name } = req.body;
    let slug = slugify(name.toLowerCase());
    
    // Since we're not using a database, we'll just return a success message
    // In a real application, you might want to implement some kind of in-memory workspace management
    res.status(200).json({ 
      data: { 
        name, 
        slug,
        message: 'Workspace creation simulated',
        creator: session.user.email
      } 
    });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
