import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";

const ethToTLRate = 88337; // Sabit kur

function ProductCard({
  product,
  currentAccount,
  purchaseProduct,
  deleteProduct,
  resellProduct,
}) {
  const [openResell, setOpenResell] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  const priceInEth = ethers.utils.formatUnits(product.price, "ether");
  const priceInTL = (parseFloat(priceInEth) * ethToTLRate).toFixed(2);

  const handleResell = () => {
    try {
      const priceInEth = newPrice.toString();
      resellProduct(product.id, priceInEth.toString());
      setOpenResell(false);
    } catch (error) {
      console.error("Resell işlemi sırasında hata:", error);
      alert(`Resell işlemi sırasında hata: ${error.message}`);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        sx={{
          objectFit: "cover",
          borderRadius: "12px 12px 0 0",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "10px" }}
        >
          Fiyat: {parseFloat(priceInEth).toFixed(4)} ETH /{" "}
          <span
            style={{ fontWeight: "bold", fontSize: "1.2em", color: "green" }}
          >
            {priceInTL} TL
          </span>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Sahip: {product.owner}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: product.purchased ? "green" : "red",
          }}
        >
          Satın Alındı: {product.purchased ? "Evet" : "Hayır"}
        </Typography>
      </CardContent>
      <CardActions>
        {!product.purchased &&
          product.owner.toLowerCase() !== currentAccount?.toLowerCase() && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => purchaseProduct(product.id, product.price)}
              sx={{ margin: "10px" }}
            >
              Satın Al
            </Button>
          )}
        {product.owner.toLowerCase() === currentAccount?.toLowerCase() && (
          <>
            {!product.purchased && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => deleteProduct(product.id)}
                sx={{ margin: "10px" }}
              >
                Sil
              </Button>
            )}
            {product.purchased && (
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => setOpenResell(true)}
                sx={{ margin: "10px" }}
              >
                Yeniden Sat
              </Button>
            )}
          </>
        )}
      </CardActions>

      <Dialog open={openResell} onClose={() => setOpenResell(false)}>
        <DialogTitle>Ürünü Yeniden Satışa Çıkar</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Yeni Fiyat (ETH)"
            type="number"
            fullWidth
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResell(false)} color="secondary">
            İptal
          </Button>
          <Button onClick={handleResell} color="primary">
            Satışa Çıkar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default ProductCard;
