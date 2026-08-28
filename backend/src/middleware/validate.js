/**
 * Zod validation middleware factory.
 * Rejects requests failing validation with 400 and structured error body: { "errors": [...] }
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({ message: 'Invalid request data', errors: [err.message] });
    }
  };
};
