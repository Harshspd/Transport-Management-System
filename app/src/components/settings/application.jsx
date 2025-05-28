import React, { useState, useEffect, useRef } from "react";
import { Box, Link, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { uploadFiles, updateAccount, getAccountById } from "../../actions/settingAction";
import { updateNavbarLogo } from "store/actions";

export default function Application() {
  const [id, setId] = useState("");
  const [accountDetails, setAccountDetails] = useState({});
  const [logoPreview, setLogoPreview] = useState();
  const fileInputRef = useRef(null);
  const [uploadedData, setUploadedData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let storedData = localStorage.getItem("user");
    if (storedData) {
      storedData = JSON.parse(storedData);
      setId(storedData?.account_id);
    }
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientDataById = await getAccountById(id);
        if (clientDataById) {
          setAccountDetails(clientDataById);
          setLogoPreview(clientDataById.logo);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) fetchClientData();
  }, [id]);

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setUploadedData(file);
    setLogoPreview(URL.createObjectURL(file));
    try {
      const response = await dispatch(uploadFiles(file));
      await dispatch(
        updateAccount({
          ...accountDetails,
          client_id: id,
          logo: response.payload.fullPath,
        })
      );
      dispatch(updateNavbarLogo(response.payload.fullPath)); 
      localStorage.setItem('navbarLogo',response.payload.fullPath)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteLogo = async () => {
    setLogoPreview(null);
    localStorage.removeItem('navbarLogo')
    await dispatch(updateAccount({ ...accountDetails, client_id: id, logo: "" }));
    dispatch(updateNavbarLogo(null)); 
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedData(file);
      try {
        const response = await dispatch(uploadFiles(file));
        await dispatch(
          updateAccount({
            ...accountDetails,
            client_id: id,
            logo: response.payload.fullPath,
          })
        );
        dispatch(updateNavbarLogo(response.payload.fullPath)); 
        localStorage.setItem('navbarLogo',response.payload.fullPath)
        setLogoPreview(response.payload.fullPath);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        border: "1px dashed gray",
        borderRadius: "10px",
        height: "175px",
        width: "280px",
        textAlign: "center",
        position: "relative",
        "&:hover .hover-buttons": {
          display: "flex",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {logoPreview ? (
        <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
          <img
            src={logoPreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              padding: "8px",
            }}
          />
          <Box
            className="hover-buttons"
            sx={{
              display: "none",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              gap: 2,
            }}
          >
            <IconButton onClick={handleFile} size="small">
              <EditIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
            <IconButton onClick={handleDeleteLogo} size="small">
              <DeleteIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Link href="#" onClick={handleFile} sx={{ display: "block", mb: 1 }}>
            Upload a file
          </Link>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <p>or drag and drop</p>
        </Box>
      )}
    </Box>
  );
}
