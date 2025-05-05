import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  res.json({ count: 3 })
})

export default router