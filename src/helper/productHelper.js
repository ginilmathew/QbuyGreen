
export function getPrice(singleProduct) {
    setSelectedVariant(singleProduct?.variants?.[0])
    if (singleProduct?.variants?.length > 0) {
        if (singleProduct?.variants?.[0]?.offer_price) {
            if (moment(singleProduct?.variants?.[0]?.offer_date_from) <= moment() && moment(singleProduct?.variants?.[0]?.offer_date_to) >= moment()) {
                return singleProduct?.variants?.[0]?.offer_price
                //return singleProduct?.variants?.[0]?.offer_price;
            }
            else {
                if(singleProduct?.variants?.[0]?.regular_price > 0){
                    return singleProduct?.variants?.[0]?.regular_price
                }
                else{
                    let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price)/100) * parseFloat(singleProduct?.variants?.[0]?.commission)
                    let price = parseFloat(singleProduct?.variants?.[0]?.seller_price) + commission
                    return price;
                }
                //return singleProduct?.variants?.[0]?.regular_price;
            }
        }
        else {
            if(singleProduct?.variants?.[0]?.regular_price > 0){
                return singleProduct?.variants?.[0]?.regular_price
            }
            else{
                let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price)/100) * parseFloat(singleProduct?.variants?.[0]?.commission)
                let price = parseFloat(singleProduct?.variants?.[0]?.seller_price) + commission
                return price
            }
        }
    }
    else {
        if (singleProduct?.offer_price) {
            if (moment(singleProduct?.offer_date_from) <= moment() && moment(singleProduct?.offer_date_to) >= moment()) {
                return singleProduct?.offer_price
                //return singleProduct?.offer_price;
            }
            else {
                if(singleProduct?.regular_price > 0){
                    return singleProduct?.regular_price
                }
                else{
                    let commission = (parseFloat(singleProduct?.seller_price)/100) * parseFloat(singleProduct?.commission)
                    let price = parseFloat(singleProduct?.seller_price) + commission
                    return price
                }
                //setPrice(singleProduct?.regular_price)
                //return singleProduct?.regular_price;
            }
        }
        else {
            if(singleProduct?.regular_price > 0){
                return singleProduct?.regular_price
            }
            else{
                let commission = (parseFloat(singleProduct?.seller_price)/100) * parseFloat(singleProduct?.commission)
                let price = parseFloat(singleProduct?.seller_price) + commission
                return price
            }
        }
    }
}