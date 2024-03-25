import express from "express";
import { getUsers, Register, Login, Logout, ValidateToken } from "../controllers/Users.js";
import { verifyToken } from "../middleware/Auth.js";
import { refreshToken } from "../controllers/refreshtoken.js";
import { ListAlumni, RegisterAlumni } from "../controllers/HomeController.js";
import { Create as CreateArt, Update as UpdateArt, Edit as EditArt, Delete as DeleteArt, ListArtikel } from "../controllers/Post.js";
import { ListCategory, Update as UpdateCat, Edit as EditCat, Delete as DeleteCat, Create as CreateCat } from "../controllers/Category.js";
import { ListBimbingangan } from "../controllers/Bimbingan.js";

const router = express.Router();
router.get('/users', verifyToken, getUsers);
router.post('/users', verifyToken, Register);
router.post('/validatetoken', verifyToken, ValidateToken);
router.post('/login', Login);

router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/master/artikel', verifyToken, ListArtikel)
router.post('/master/artikel/create', verifyToken, CreateArt)
router.get('/master/artikel/edit/:id', verifyToken, EditArt)
router.delete('/master/artikel/:id', verifyToken, DeleteArt)

//router master category 
router.get('/master/category', ListCategory)
router.post('/master/category/create', CreateCat)
router.post('/master/category/update/:id', UpdateCat)
router.delete('/master/category/:id', DeleteArt)

// data bimbingan.
router.get('/master/bimbingan', CreateArt)
router.post('/master/bimbingan', EditArt)
router.post('/master/bimbingan/:id', UpdateArt)
router.delete('/master/bimbingan/:id', DeleteArt)
// alumni data alumni  
router.get('/alumni/list', ListAlumni)
router.post('/alumni/register', RegisterAlumni)
router.post('/master/konsultasi', ListBimbingangan)

export default router;