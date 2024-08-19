# Web3 Marketplace DApp

Bu proje, Ethereum blockchain üzerinde çalışan basit bir Web3 Marketplace DApp'idir. Kullanıcılar, bu uygulama aracılığıyla ürünler oluşturabilir, satın alabilir ve daha sonra yeniden satışa çıkarabilirler. Uygulamanın akıllı sözleşmeleri Solidity ile yazılmış olup, frontend kısmında React kullanılmıştır.

![web3MarketPlace](https://github.com/user-attachments/assets/9f16713a-4f47-4bee-97b3-580e4fa5d65d)
## Özellikler

- **Ürün Oluşturma:** Kullanıcılar MetaMask cüzdanını kullanarak yeni ürünler oluşturabilirler.
- **Ürün Satın Alma:** Kullanıcılar listelenen ürünleri Ethereum kullanarak satın alabilir.
- **Yeniden Satış:** Satın alınan ürünler daha sonra farklı bir fiyatla yeniden satışa çıkarılabilir.
- **Dark Mode Desteği:** Kullanıcılar uygulamanın görünümünü dark mode ve light mode arasında değiştirebilir.

## Kurulum ve Çalıştırma

### Gereksinimler

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) Tarayıcı Uzantısı
- [Hardhat](https://hardhat.org/) (Ethereum geliştirme ortamı)

### Adımlar

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/yourusername/web3-marketplace.git
   cd web3-marketplace
  
2. **Bağımlılıkları Kurun**
  ```bash
  npm install
  ```
3. **Ethereum Node'u Çalıştırın (Hardhat ile):**
  ```bash
  npx hardhat node
  ```   
4. **Akıllı Sözleşmeyi Deploy Edin:**
  Yeni bir terminal penceresi açın ve aşağıdaki komutu çalıştırın:
  ```bash
  npx hardhat run scripts/deploy.js --network localhost
  ```
5. **Uygulamayı Başlatın:**
  Frontend klasörünü gidin ve başlatın:
  ```bash
  npm start
  ```
  Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

###  Kullanım
**Cüzdanı Bağlayın:**
Uygulama, MetaMask kullanarak Ethereum blockchain'ine bağlanmanızı gerektirir. MetaMask'ta bir test ağı kullanarak ETH ile bir hesap oluşturun.

**Ürün Oluşturma:**
Ürün adı, fiyat (ETH cinsinden) ve ürün resmi URL'si ile yeni bir ürün ekleyin. Ürünü oluşturduğunuzda, ürün marketplace'de listelenecektir.

**Ürün Satın Alma:**
Marketplace'deki ürünleri satın almak için "Satın Al" butonuna tıklayın. MetaMask'ta işlemi onaylayın.

**Ürün Yeniden Satışı:**
Satın aldığınız bir ürünü yeni bir fiyatla yeniden satışa çıkarabilirsiniz. Bunun için ürünün altındaki "Yeniden Sat" butonuna tıklayın.
