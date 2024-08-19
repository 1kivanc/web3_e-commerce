// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ecommerce {
    struct Product {
        uint id;
        string name;
        uint price;
        string imageUrl;
        address payable owner;
        bool purchased;
        bool exists;
    }

    mapping(uint => Product) public products;
    uint public productCount = 0;

    event ProductCreated(
        uint id,
        string name,
        uint price,
        string imageUrl,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        string imageUrl,
        address payable owner,
        bool purchased
    );

    event ProductDeleted(uint id);

    event ProductResold(uint id, uint newPrice, address newOwner);

    function createProduct(
        string memory _name,
        uint _price,
        string memory _imageUrl
    ) public {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Product price must be greater than zero");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");

        productCount++;

        products[productCount] = Product(
            productCount,
            _name,
            _price,
            _imageUrl,
            payable(msg.sender),
            false,
            true // ürün çıktı
        );

        emit ProductCreated(
            productCount,
            _name,
            _price,
            _imageUrl,
            payable(msg.sender),
            false
        );
    }

    function purchaseProduct(uint _id) public payable {
        Product storage _product = products[_id];
        address payable _seller = _product.owner;

        require(_product.exists, "Product does not exist");
        require(!_product.purchased, "Product has already been purchased");
        require(msg.value >= _product.price, "Insufficient Ether sent");
        require(_seller != msg.sender, "Cannot buy your own product");

        _product.owner = payable(msg.sender);
        _product.purchased = true;

        _seller.transfer(msg.value);

        emit ProductPurchased(
            _id,
            _product.name,
            _product.price,
            _product.imageUrl,
            _product.owner,
            _product.purchased
        );
    }

    function deleteProduct(uint _id) public {
        Product storage _product = products[_id];
        require(
            _product.owner == msg.sender,
            "Only the owner can delete the product"
        );

        _product.exists = false;

        emit ProductDeleted(_id);
    }

    function resellProduct(uint _id, uint _newPrice) public {
        Product storage _product = products[_id];
        require(_product.owner == msg.sender, "You do not own this product");
        require(_newPrice > 0, "New price must be greater than zero");
        require(_product.purchased, "Product has not been purchased yet");

        _product.price = _newPrice;
        _product.purchased = false;

        emit ProductResold(_id, _newPrice, _product.owner);
    }

    function purchaseResoldProduct(uint _id) public payable {
        purchaseProduct(_id);
    }
}
