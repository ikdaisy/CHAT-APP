import { Router } from "express";
import * as rh from "./requestHandler.js";
import Auth from './middleware/Auth.js'


const router=Router();
router.route("/signup").post(rh.signUp)
router.route("/signin").post(rh.signIn)
router.route("/checkemail").post(rh.checkEmail)
router.route("/changepassword").post(rh.changePassword)
router.route("/getuser/").get(Auth,rh.getUser)
router.route("/getreceiver/:_id").get(Auth,rh.getReceiver)
router.route("/edituser").put(Auth,rh.editUser)
router.route("/getcontacts").get(Auth,rh.getContacts)
router.route("/getcontact/:rid").get(Auth,rh.getContact)
router.route("/addmessage/:rid").post(Auth,rh.addMessage);
router.route("/deletemessage/:_id").delete(Auth,rh.deleteMessage);
router.route("/openchat/:_id").get(Auth,rh.openChat);






export default router;