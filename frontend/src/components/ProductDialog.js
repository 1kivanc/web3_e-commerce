import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const ethToTlRate = 88337;

export default function ProductDialog({
  open,
  handleClose,
  name,
  setName,
  price,
  setPrice,
  imageUrl,
  setImageUrl,
  createProduct,
}) {
  const handlePriceChange = (e) => {
    const ethPrice = e.target.value;
    setPrice(ethPrice);
  };

  const calculatePriceInTL = () => {
    return (price * ethToTlRate).toFixed(2);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Ürün Adı"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ürün Fiyatı (ETH)"
          fullWidth
          value={price}
          onChange={handlePriceChange}
        />
        <Typography
          variant="body2"
          style={{ marginTop: "10px", color: "lightgreen" }}
        >
          TL Fiyatı: {calculatePriceInTL()} TL
        </Typography>
        <TextField
          margin="dense"
          label="Resim URL"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          İptal
        </Button>
        <Button onClick={createProduct} color="primary">
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
