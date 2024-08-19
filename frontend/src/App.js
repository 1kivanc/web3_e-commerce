import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ProductCard from "./components/ProductCard";
import ProductDialog from "./components/ProductDialog";
import { Container, Grid, Button, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Ecommerce from "../src/artifacts/contracts/Ecommerce.sol/Ecommerce.json";

const ecommerceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            ecommerceAddress,
            Ecommerce.abi,
            signer
          );

          setContract(contract);

          const accounts = await provider.listAccounts();
          setCurrentAccount(accounts[0]);

          const productCount = await contract.productCount();
          let productsArray = [];
          for (let i = 1; i <= productCount; i++) {
            const product = await contract.products(i);
            if (product.exists) {
              productsArray.push(product);
            }
          }
          setProducts(productsArray);
        } catch (error) {
          console.error("Error initializing contract:", error);
          alert(
            "Error initializing contract. Please check the console for details."
          );
        }
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };
    init();
  }, []);

  const createProduct = async () => {
    try {
      if (!name || !price || !imageUrl) {
        alert("Lütfen tüm alanları doldurun.");
        return;
      }

      const priceInWei = ethers.utils.parseEther(price);

      const transaction = await contract.createProduct(
        name,
        priceInWei,
        imageUrl,
        {
          gasLimit: 2100000,
          gasPrice: ethers.utils.parseUnits("20", "gwei"),
        }
      );

      await transaction.wait();
      alert("Ürün başarıyla oluşturuldu!");

      const productCount = await contract.productCount();
      const newProduct = await contract.products(productCount);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setOpen(false);
    } catch (error) {
      console.error("Ürün oluşturulurken hata:", error);
      alert(`Ürün oluşturulurken hata: ${error.message}`);
    }
  };

  const purchaseProduct = async (id, price) => {
    try {
      const transaction = await contract.purchaseProduct(id, {
        value: price,
        gasLimit: 2100000,
        gasPrice: ethers.utils.parseUnits("20", "gwei"),
      });
      await transaction.wait();
      alert("Ürün başarıyla satın alındı!");

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id.toNumber() === id
            ? { ...product, purchased: true, owner: currentAccount }
            : product
        )
      );
    } catch (error) {
      console.error("Ürün satın alınırken hata:", error);
      alert(`Ürün satın alınırken hata: ${error.message}`);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const transaction = await contract.deleteProduct(id, {
        gasLimit: 2100000,
        gasPrice: ethers.utils.parseUnits("20", "gwei"),
      });
      await transaction.wait();
      alert("Ürün başarıyla silindi!");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id.toNumber() !== id)
      );
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
      alert(`Ürün silinirken hata: ${error.message}`);
    }
  };

  const resellProduct = async (id, newPrice) => {
    try {
      if (!newPrice) {
        alert("Lütfen geçerli bir fiyat girin.");
        return;
      }

      const priceInWei = ethers.utils.parseEther(newPrice);

      const transaction = await contract.resellProduct(id, priceInWei, {
        gasLimit: 2100000,
        gasPrice: ethers.utils.parseUnits("20", "gwei"),
      });

      await transaction.wait();
      alert("Ürün başarıyla yeniden satışa çıkarıldı!");

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id.toNumber() === id
            ? { ...product, price: priceInWei, purchased: false }
            : product
        )
      );
    } catch (error) {
      console.error("Ürün yeniden satışa çıkarılırken hata:", error);
      alert(`Ürün yeniden satışa çıkarılırken hata: ${error.message}`);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Web3 Marketplace
          </Typography>
          <Typography variant="body1">
            {currentAccount
              ? `Bağlı cüzdan: ${currentAccount}`
              : "Hiçbir cüzdan bağlı değil"}
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Ürün Ekle
        </Button>
        <ProductDialog
          open={open}
          handleClose={handleClose}
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          createProduct={createProduct}
        />
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCard
                product={product}
                currentAccount={currentAccount}
                purchaseProduct={purchaseProduct}
                deleteProduct={deleteProduct}
                resellProduct={resellProduct}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
