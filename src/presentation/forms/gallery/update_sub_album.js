// import React from "react";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import Button from "@mui/material/Button";
// import {
//   db,
//   doc,
//   updateDoc,
//   ref,
//   uploadBytesResumable,
//   storage,
//   getDownloadURL,
// } from "../../../data/firebase";
// import { useSnackbar } from "notistack";
// import Backdrop from "@mui/material/Backdrop";
// import { Avatar, CircularProgress, Grid, Typography } from "@mui/material";
// import { Box } from "@mui/system";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles(() => ({
//   image: {
//     margin: "0px auto 15px auto",
//     width: 128,
//     height: 100,
//   },
//   mb: {
//     marginBottom: 10,
//   },
// }));

// const CircularProgressWithLabel = (props) => {
//   return (
//     <Box position="relative" display="inline-flex">
//       <CircularProgress
//         variant="determinate"
//         {...props}
//         size={90}
//         thickness={3.0}
//         style={{ color: "green" }}
//       />
//       <Box
//         top={0}
//         left={0}
//         bottom={0}
//         right={0}
//         position="absolute"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body1"
//           component="div"
//           style={{ color: "white", fontFamily: "roboto" }}
//         >{`${Math.round(props.value)}%`}</Typography>
//       </Box>
//     </Box>
//   );
// };

// const UpdateSubAlbumForm = (props) => {
//   const classes = useStyles();
//   let { setOpen, id, list, image, desc, index } = props;
//   const [formValues, setFormValues] = React.useState({
//     desc: desc,
//   });
//   const [file, setFile] = React.useState(null);
//   const [isUploading, setIsUploading] = React.useState(false);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [progress, setProgress] = React.useState(0);
//   const [previewImage, setPreviewImage] = React.useState("");

//   const { enqueueSnackbar } = useSnackbar();

//   const handleChange = (e) => {
//     const { id, name, value } = e.target;

//     if (id === "image") {
//       setFile(e.target.files[0]);
//       setPreviewImage(URL.createObjectURL(e.target.files[0]));
//       setFormValues((prevData) => ({
//         ...prevData,
//         image: e.target.value,
//       }));
//     } else {
//       setFormValues((prevData) => ({ ...prevData, [name]: value }));
//     }
//   };

//   const uploadNewImage = () => {
//     setIsUploading(true);
//     const timeNow = new Date();
//     //First upload image to firebase storage then save to firestore
//     const storageRef = ref(storage, "gallery/" + timeNow.getTime());
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const uprogress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setProgress(uprogress);
//       },
//       (error) => {
//         setIsUploading(false);
//         // console.log(error);
//         enqueueSnackbar(`${error?.message}`, { variant: "error" });
//       },
//       () => {
//         setIsUploading(false);
//         setIsLoading(true);
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           const mRef = doc(db, "gallery", "" + id);
//           try {
//             await updateDoc(mRef, {
//               title: formValues.title,
//               image: downloadURL,
//             });
//             setOpen(false);
//             setIsLoading(false);
//             enqueueSnackbar(`Gallery updated successfully`, {
//               variant: "success",
//             });
//           } catch (error) {
//             setIsLoading(false);
//             enqueueSnackbar(
//               `${error?.message || "Check your internet connection"}`,
//               {
//                 variant: "error",
//               }
//             );
//           }
//         });
//       }
//     );
//   };

//   const addRecord = async (e) => {
//     setIsLoading(true);
//     list = Object.assign([], list);
//     let object = list[index];
//     // list?.push({
//     //   desc: formValues.desc,
//     // });
//     console.log("OBJECT", { ...object });
//     let obj = { desc: "Hello", image: "http://jkfdjb" };

//     let mer = { ...list, object: obj };
//     console.log("JK", mer);

//     // const mRef = doc(db, "gallery", "" + id);

//     // if (!previewImage) {
//     //   try {
//     //     const mRef = doc(db, "gallery", "" + id);
//     //     let obj = { ...object, desc: "Hello", image: "http://jkfdjb" };
//     //     console.log("OBJEC2", obj);

//     //     await updateDoc(mRef, {
//     //       title: formValues.title,
//     //     });
//     //     setOpen(false);
//     //     setIsLoading(false);
//     //     enqueueSnackbar(`Gallery updated successfully`, {
//     //       variant: "success",
//     //     });
//     //   } catch (error) {
//     //     setIsLoading(false);
//     //     enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
//     //       variant: "error",
//     //     });
//     //   }
//     // } else {
//     //   uploadNewImage();
//     // }

//     // try {
//     //   await updateDoc(mRef, {
//     //     items: list[id],
//     //   });
//     //   setOpen(false);
//     //   setIsLoading(false);
//     //   enqueueSnackbar(`Department function added successfully`, {
//     //     variant: "success",
//     //   });
//     // } catch (error) {
//     //   setIsLoading(false);
//     //   enqueueSnackbar(`${error?.message || "Check your internet!"}`, {
//     //     variant: "error",
//     //   });
//     // }
//   };

//   return (
//     <div>
//       <Backdrop style={{ zIndex: 1200 }} open={isUploading || isLoading}>
//         {isUploading ? <CircularProgressWithLabel value={progress} /> : <div />}
//         {isLoading ? (
//           <CircularProgress
//             size={90}
//             thickness={3.0}
//             style={{ color: "white" }}
//           />
//         ) : (
//           <div />
//         )}
//       </Backdrop>
//       <ValidatorForm onSubmit={addRecord}>
//         <TextValidator
//           label="Text"
//           size="small"
//           variant="outlined"
//           value={formValues.text}
//           onChange={handleChange}
//           name="text"
//           fullWidth
//           required
//           validators={["required"]}
//           errorMessages={["Text is required"]}
//         />
//         <br />
//         <Grid container spacing={1} padding={1}>
//           <Grid item xs={12} sm={6} md={7}>
//             <TextValidator
//               id="image"
//               size="small"
//               variant="outlined"
//               value={formValues.image}
//               name="image"
//               type="file"
//               fullWidth
//               disabled={isLoading}
//               accept=".png, .jpg, .jpeg"
//               onChange={handleChange}
//               helperText="Featured image"
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={5}>
//             <div>
//               <Avatar
//                 variant="rounded"
//                 alt="Passport"
//                 src={previewImage ? previewImage : image}
//                 className={classes.image}
//               />
//             </div>
//           </Grid>
//         </Grid>
//         <br />

//         <Button
//           type="submit"
//           variant="contained"
//           disabled={isLoading}
//           fullWidth
//         >
//           Save
//         </Button>
//       </ValidatorForm>
//     </div>
//   );
// };

// export default UpdateSubAlbumForm;
