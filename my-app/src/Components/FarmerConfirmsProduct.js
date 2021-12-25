import API from '../API';
import { useState, useEffect } from 'react';
import { Table, Row, Col, ToggleButton, Container, Image, ButtonGroup, Spinner } from 'react-bootstrap';
import { PersonFill, GeoAltFill, ClockFill } from 'react-bootstrap-icons';
import "./EmployeeView.css";
import UserDropdown from "./CustomerSearchBar"

function ConfirmProduct(props) {

    const [ordersList, setOrdersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.getProductsByOneFarmer(props.timeMachine().toString())
            .then(orders => {
                setOrdersList(orders.slice(0).reverse());
                setLoading(false);
            }).catch(o => handleErrors(o));
    }, []);

    const handleErrors = (err) => {
        {/*setMessage({ msg: err.error, type: 'danger' });*/
        }
        console.log(err);
    }


   async function handleChangeConfirm(idO, idP, bol){
        console.log(bol.toString());
        let ordersListCopy = ordersList;
        ordersListCopy[idO].ProductInOrder[idP].Confirmed = bol.toString();
        setOrdersList(ordersListCopy)

        if(true){
            //API CALL successful
            return true;
        }
        else {
            handleErrors("API error");
            return false;        
        }
    }

    return (
        <>
            <Container>
                <Row className="mt-3 margine-cerca-desktop">
                    <UserDropdown users={props.users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                </Row>
            </Container>

            {loading ? <> <Row className="justify-content-center mt-5">
                < Spinner animation="border" size="xl" variant="secondary" />
            </Row > </> :
                <>
                    <Col>
                        <Table className="d-flex justify-content-center">
                            <tbody id="employee-table" align="center">
                                {ordersList.length > 0 ? <>
                                    {
                                        ordersList.map( (o, idO) => {

                                                if (selectedUser.length > 0 && o.ClientID === selectedUser[0].UserID || selectedUser.length === 0) {

                                                    return <OrderRow handleChangeConfirm={handleChangeConfirm} idO={idO} key={o.OrderID} order={o} />

                                                }
                                            }
                                            )
                                    } </> : <NoOrders message={"There are no orders containing your products yet"} />}
                            </tbody>
                        </Table>
                    </Col>
                </>
            }
        </>
    );
}



function OrderRow(props) {

    return (
        <>
            <tr>
                <td>

                    <Container>

                        <Row className="mt-2">
                            <h1 style={{ fontSize: 25 }} align={"left"}>Order #{props.order.OrderID}</h1>
                        </Row>

                        <Row className="mb-3 sfondoriga">
                            <Row>
                                <Col><PersonFill /></Col>
                                <Col><ClockFill /></Col>
                                <Col><GeoAltFill /></Col>
                            </Row>

                            <Row className="mb-1">
                                <Col className="ridotto-mobile">{props.order.Name} {props.order.Surname}</Col>
                                <Col className="ridotto-mobile">{props.order.Timestamp}</Col>
                                <Col className="ridotto-mobile">{props.order.Address}, {props.order.State}</Col>
                            </Row>
                        </Row>

                        <Table className="justify-content-center">
                            <tbody align="center">
                                {props.order.ProductInOrder.map((p, i) => (
                                    <ProductList handleChangeConfirm={props.handleChangeConfirm} idO={props.idO} idP={i} confirmed={p.Confirmed} key={p.ProductID+props.order.OrderID+"_"+i} uniqueID={p.ProductID+props.order.OrderID+"_"+i} product={p} />
                                ))}
                            </tbody>
                        </Table>

                    </Container>
                </td>
            </tr>
        </>
    );
}


function ProductList(props) {

    async function HandleConfirmation(bol){
        if (bol){
            if(await props.handleChangeConfirm(props.idO, props.idP, bol))
                setCheckedTrue(true);
        }else{
            if(await props.handleChangeConfirm(props.idO, props.idP, bol))
                setCheckedFalse(true);
        }
    }


    const [checkedTrue, setCheckedTrue] = useState(props.confirmed === "" ? false : props.confirmed === "true" ? true : false);
    const [checkedFalse, setCheckedFalse] = useState(props.confirmed === "" ? false : props.confirmed === "false" ? true : false);
    return (
        <tr>
            <td>
                <Container>
                    <Row className="mb-2 align-items-center font-tabella">
                        <Col>
                            <center>{props.product.NameProduct}</center>
                        </Col>
                        <Col>
                            Quantity: {props.product.number}
                        </Col>
                        <Col>
                            Price: €{props.product.Price.toFixed(2)}
                        </Col>
                        <Col>
                            <ConfirmButton idO={props.idO} idP={props.idP} log={props.product.Product} uniqueID={props.uniqueID} HandleConfirmation={HandleConfirmation} setCheckedTrue={setCheckedTrue} checkedTrue={checkedTrue} setCheckedFalse={setCheckedFalse} checkedFalse={checkedFalse} /> 
                        </Col>
                    </Row>
                </Container>
            </td>
        </tr>
    );
}

function ConfirmButton(props){

    return (
        <ButtonGroup className="mb-2">
                <ToggleButton style={{width: "3rem"}}
        className="mb-2"
        id={props.uniqueID+"true"}
        type="checkbox"
        variant="outline-success"
        disabled={props.checkedFalse || props.checkedTrue ? true : false  }
        checked={props.checkedTrue}
        onChange={(e) => props.HandleConfirmation(true)} >
       ✔
      </ToggleButton>
        <ToggleButton  style={{width: "3rem"}}
        className="mb-2"
        id={props.uniqueID+"false"}
        type="checkbox"
        disabled={props.checkedFalse || props.checkedTrue ? true : false  }
        variant="outline-danger"
        checked={props.checkedFalse}
        onChange={(e) => props.HandleConfirmation(false)} >
        ✘
      </ToggleButton>

        </ButtonGroup>
    );

}

function NoOrders(props) {
    return (<Row style={{ height: "50vh" }} className="align-items-center">

        <div><Image className="d-block mx-auto img-fluid w-30" src="/images/logo.png" />
            <div className="d-flex justify-content-center "><h4>{props.message}</h4></div>
        </div>
    </Row>

    );
}


export default ConfirmProduct;
