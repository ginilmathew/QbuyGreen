import moment from "moment";
import { min, max } from 'lodash'

export function getProduct(product){
    let { _id, product_id, name, description, store, franchisee, weight, type, image, stock, minimum_qty, product_image, order_count, is_wishlist, viewCount, attributes  } = product

    let variant = product?.variants?.length > 0 ? true : false
    let minQty = minimum_qty ? parseFloat(minimum_qty) : 1


    let newProduct = {
        _id, 
        product_id, 
        name, 
        description, 
        store, 
        franchisee, 
        weight, 
        type, 
        image, 
        stock, 
        minQty, 
        product_image, 
        order_count, 
        is_wishlist,
        variant,
        viewCount,
        attributes: attributes
    }

    
    let variants = [];
    if(variant){
        product?.variants?.map(vari => {
            let offer = vari?.offer_price ? parseFloat(vari?.offer_price) : 0;
            let offerFromDate = vari?.offer_date_from ? moment(vari?.offer_date_from).format("YYYY-MM-DD") : null
            let offerToDate = vari?.offer_date_to ? moment(vari?.offer_date_to).format("YYYY-MM-DD") : null
            let regular = vari?.regular_price ? parseFloat(vari?.regular_price) : 0
            let seller = vari?.seller_price ? parseFloat(vari?.seller_price) : 0
            let commission = vari?.commission ? parseFloat(vari?.commission) : 0
            let delivery = vari?.fixed_delivery_price ? parseFloat(vari?.fixed_delivery_price) : 0
            let stockValue = vari?.stock_value ? parseFloat(vari?.stock_value) : 0
            let price;

            if(stock){
                //if product requires stock
                if(minQty <= stockValue){
                    if(offer > 0){
                        //products have offer price , check offer price in valid range
                        if(offerFromDate && offerToDate){
                            if(moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate){
                                price = offer;
                            }
                            else if(regular > 0){
                                price = regular
                            }
                            else{
                                let comm = (seller/100) * commission
                                let amount = seller + comm;
                                price = amount
                            }
                        }
                        else if(regular > 0){
                            price = regular
                        }
                        else{
                            let comm = (seller/100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if(regular > 0){
                        price = regular
                    }
                    else{
                        let comm = (seller/100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                    variants.push({
                        id: vari?._id,
                        title: vari?.title,
                        attributs: vari?.attributs,
                        price,
                        minQty,
                        stockValue,
                        delivery,
                        available : true
                    })
                }
                else{
                    //out of stock
                    variants.push({
                        id: vari?._id,
                        title: vari?.title,
                        attributs: vari?.attributs,
                        price : null,
                        minQty,
                        stockValue,
                        delivery,
                        available : false
                    })
                }
            }
            else{
                //no need to check stock
                if(offer > 0){
                    //products have offer price , check offer price in valid range
                    if(offerFromDate && offerToDate){
                        if(moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate){
                            price = offer;
                        }
                        else if(regular > 0){
                            price = regular
                        }
                        else{
                            let comm = (seller/100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if(regular > 0){
                        price = regular
                    }
                    else{
                        let comm = (seller/100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }
                else if(regular > 0){
                    price = regular
                }
                else{
                    let comm = (seller/100) * commission
                    let amount = seller + comm;
                    price = amount
                }
                variants.push({
                    id: vari?._id,
                    title: vari?.title,
                    attributs: vari?.attributs,
                    price,
                    minQty,
                    stockValue,
                    delivery,
                    available : true
                })
            }
        })
        newProduct['variants'] = variants;
        // Get the minimum price
        let priceList=[];
        variants.map(vari => {
            if(vari?.available){
                if(vari?.price){
                    priceList.push(vari?.price)
                }
                
            }
        })
        if(priceList?.length > 1){
            newProduct['price'] = `${min(priceList)}-${max(priceList)}`
            newProduct['available'] = true
        }
        else if(priceList?.length === 1){
            newProduct['price'] = priceList[0]
            newProduct['available'] = true
        }
        else{
            newProduct['available'] = false
            newProduct['price']= null
        }
        
    }
    else{
        let offer = product?.offer_price ? parseFloat(product?.offer_price) : 0;
        let offerFromDate = product?.offer_date_from ? moment(product?.offer_date_from).format("YYYY-MM-DD") : null
        let offerToDate = product?.offer_date_to ? moment(product?.offer_date_to).format("YYYY-MM-DD") : null
        let regular = product?.regular_price ? parseFloat(product?.regular_price) : 0
        let seller = product?.seller_price ? parseFloat(product?.seller_price) : 0
        let commission = product?.commission ? parseFloat(product?.commission) : 0
        let delivery = product?.fixed_delivery_price ? parseFloat(product?.fixed_delivery_price) : 0
        let stockValue = product?.stock_value ? parseFloat(product?.stock_value) : 0
        let price;
        if(stock){
            if(stockValue >= minQty){
                if(offer > 0){
                    //products have offer price , check offer price in valid range
                    if(offerFromDate && offerToDate){
                        if(moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate){
                            price = offer;
                        }
                        else if(regular > 0){
                            price = regular
                        }
                        else{
                            let comm = (seller/100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if(regular > 0){
                        price = regular
                    }
                    else{
                        let comm = (seller/100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }
                else if(regular > 0){
                    price = regular
                }
                else{
                    let comm = (seller/100) * commission
                    let amount = seller + comm;
                    price = amount
                }
                newProduct['available'] = true
                newProduct['price'] = price;
            }
            else{
                //OUT OF STOCK
                newProduct['available'] = false;
                newProduct['price'] = null;
            }
        }
        else{
            if(offer > 0){
                //products have offer price , check offer price in valid range
                if(offerFromDate && offerToDate){
                    if(moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate){
                        price = offer;
                    }
                    else if(regular > 0){
                        price = regular
                    }
                    else{
                        let comm = (seller/100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }
                else if(regular > 0){
                    price = regular
                }
                else{
                    let comm = (seller/100) * commission
                    let amount = seller + comm;
                    price = amount
                }
               
            }
            else if(regular > 0){
                price = regular
            }
            else{
                let comm = (seller/100) * commission
                let amount = seller + comm;
                price = amount
            }

            newProduct['price'] = price;
            newProduct['available'] = true;
        }
        newProduct['stockValue'] = stockValue;
        newProduct['delivery'] = delivery;
    }
    
    return newProduct;
    
}