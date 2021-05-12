import React, { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhoneAlt,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";

import HandleMatchRegex from "../utils/HandleMatchRegex";
import Api from "../Api";

//Arreglo de Objetos que sirve la estructura de los formularios
let formContext = [
  {
    row: 1,
    values: [
      {
        name: "Nombre",
        key: "name",
        img: faUser,
        validate: "Digite un nombre válido",
        regex: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s]+$/i,
      },
      {
        name: "Apellidos",
        key: "lastname",
        img: faUser,
        validate: "Digite un apellido válido",
        regex: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s]+$/i,
      },
    ],
  },
  {
    row: 2,
    values: [
      {
        name: "Correo Electrónico",
        key: "email",
        img: faEnvelope,
        validate: "Digite un correo válido",
        regex: /^\S+@\S+\.\S+$/,
      },
      {
        name: "Número de teléfono",
        key: "cellphone",
        img: faPhoneAlt,
        validate: "Digite un número de teléfono válido",
        regex: /^[0-9]*$/,
      },
    ],
  },
  {
    row: 3,
    values: [
      {
        name: "Código Postal",
        key: "postalCode",
        validate: "Digite 5 números",
        img: faMapMarkedAlt,
        regex: /^[0-9]{0,5}$/,
      },
      {
        name: "Colonia",
        key: "colonies",
        img: faMapMarkedAlt,
        validate: "Digite una colonia válida",
        regex: /(.*?)/,
      },
    ],
  },
  {
    row: 4,
    values: [
      {
        name: "Estado/Región",
        key: "state",
        img: faMapMarkedAlt,
        validate: "Digite una región válida",
        regex: /(.*?)/,
      },
      {
        name: "Ciudad",
        key: "city",
        img: faMapMarkedAlt,
        validate: "Digite una ciudad válida",
        regex: /(.*?)/,
      },
    ],
  },
  {
    row: 5,
    values: [
      {
        name: "Delegación o Municipio",
        key: "town",
        img: faMapMarkedAlt,
        validate: "Llene el campo con su municipio",
        regex: /(.*?)/,
      },
      {
        name: "Calle",
        key: "street",
        img: faMapMarkedAlt,
        validate: "Coloque la calle a ubicar",
        regex: /(.*?)/,
      },
    ],
  },
];
//Arreglo de Objetos que sirve la estructura de los formularios

function Body() {
  //[Fetch States]
  const [fetch, setFetch] = useState(false);
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("");
  const [body, setBody] = useState({});
  //[Fetch States]

  //[Api data states]
  const [postalList, setPostalList] = useState("");
  const [productList, setProductList] = useState([]);
  const [contact, setContact] = useState("");
  //[Api data states]

  //Hook useState dinámico para manejar validaciones en campo de formulario
  const [form, setForm] = useState({
    name: { content: "", errorMessage: "" },
    lastname: { content: "", errorMessage: "" },
    email: { content: "", errorMessage: "" },
    cellphone: { content: "", errorMessage: "" },
    postalCode: { content: "", errorMessage: "" },
    colonies: { content: "", errorMessage: "" },
    state: { content: "", errorMessage: "" },
    city: { content: "", errorMessage: "" },
    town: { content: "", errorMessage: "" },
    street: { content: "", errorMessage: "" },
  });

  //Hook useState dinámico para manejar validaciones en campo de formulario

  //Instanca de Custom Hook para consumo de APIs
  const { data, status } = Api({
    url,
    method,
    body,
    query: fetch,
  });
  //Instanca de Custom Hook para consumo de APIs

  //fetch de los productos al montar el componente
  useEffect(() => {
    setUrl(`products`);
    setMethod("GET");
    setFetch(true);
    setTimeout(() => {
      setFetch(false);
    }, 500);
  }, []);
  //fetch de los productos al montar el componente

  //Ciclo de vida que escucha los eventos de fetch
  useEffect(() => {
    if (data) {
      if (url.includes("postalCodes")) {
        setPostalList(data);
      }
      if (url.includes("products")) {
        setProductList(data);
      }
      if (url.includes("contact")) {
        setContact(status);
      }
    }
  }, [data, url, status]);
  //Ciclo de vida que escucha los eventos de fetch

  //Ciclo de vida como logger de API consumida
  useEffect(() => {
    if (postalList.length || productList.length) {
      console.log("[Data de API]", {
        postales: postalList,
        productos: productList,
        contact: contact,
      });
    }
  }, [postalList, productList, contact]);
  //Ciclo de vida como logger de API consumida
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "auto 5%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "70%",
          padding: "1rem",
          border: "1px solid gray",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            textAlign: "left",
            width: "100%",
            borderBottom: "3px solid black",
          }}
        >
          DIRECCIÓN DE ENVÍO
        </div>
        {formContext.map((v, i) => {
          //validaciones para formularios dinámicos
          let inputLeftField = v.values[0].key;
          let inputRightField = v.values[1].key;
          let currentLeftField = v.values[0].name;
          let currentRightField = v.values[1].name;
          let currentLeftRegex = v.values[0].regex;
          let currentRightRegex = v.values[1].regex;
          let currentLeftException = v.values[0].validate;
          let currentRightExceptionR = v.values[1].validate;
          let leftFieldValue =
            form &&
            form[inputLeftField] &&
            Object.values(form[inputLeftField])[0];
          let rightFieldValue =
            form &&
            form[inputRightField] &&
            Object.values(form[inputRightField])[0];
          let leftFieldHandler =
            form &&
            form[inputLeftField] &&
            Object.values(form[inputLeftField])[1] === false;
          let rightFieldHandler =
            form &&
            form[inputRightField] &&
            Object.values(form[inputRightField])[1] === false;
          //validaciones para formularios dinámicos

          return (
            //Parte Izquierda de la página
            <section key={i} className="section-form">
              <div className="left-section">
                <InputGroup className="input-group">
                  <InputGroupAddon
                    addonType="prepend"
                    className="input-group-addon"
                  >
                    <InputGroupText className="input-group-text">
                      <FontAwesomeIcon
                        icon={v.values[0].img}
                        size="1x"
                        color="white"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={
                      leftFieldValue
                        ? leftFieldValue
                        : postalList &&
                          postalList[inputLeftField] &&
                          Object.values(postalList[inputLeftField]).length
                        ? postalList[inputLeftField]
                        : ""
                    }
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      let { value } = HandleMatchRegex(
                        inputValue,
                        currentLeftRegex
                      );
                      setForm({
                        ...form,
                        [inputLeftField]: {
                          content: inputValue,
                          errorMessage: value,
                        },
                      });
                      if (
                        currentLeftField === "Código Postal" &&
                        inputValue.length >= 5
                      ) {
                        setUrl(`postalCodes/${e.target.value}`);
                        setMethod("GET");
                        setFetch(true);
                        setTimeout(() => {
                          setFetch(false);
                        }, 500);
                      } else {
                        setFetch(false);
                      }
                    }}
                    className="input"
                    placeholder={currentLeftField}
                  />
                </InputGroup>
                {leftFieldHandler === true && (
                  <label
                    style={{
                      fontSize: "12px",
                      color: "red",
                      textAlign: "center",
                      margin: "-5px auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {currentLeftException}
                  </label>
                )}
              </div>
              <div className="right-section">
                {inputRightField === "colonies" &&
                postalList &&
                postalList.colonies &&
                postalList.colonies.length > 1 ? (
                  <InputGroup className="input-group">
                    <InputGroupAddon
                      addonType="prepend"
                      className="input-group-addon"
                    >
                      <InputGroupText className="input-group-text">
                        <FontAwesomeIcon
                          icon={v.values[1].img}
                          size="1x"
                          color="white"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      style={{
                        width: "185px",
                        maxWidth: "185px",
                      }}
                      className="input"
                      type="select"
                      name="selectMulti"
                    >
                      {postalList.colonies.map((d, i) => {
                        return <option key={i}>{d}</option>;
                      })}
                    </Input>
                  </InputGroup>
                ) : (
                  <InputGroup className="input-group">
                    <InputGroupAddon
                      addonType="prepend"
                      className="input-group-addon"
                    >
                      <InputGroupText className="input-group-text">
                        <FontAwesomeIcon
                          icon={v.values[1].img}
                          size="1x"
                          color="white"
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      value={
                        rightFieldValue
                          ? rightFieldValue
                          : postalList &&
                            postalList[inputRightField] &&
                            Object.values(postalList[inputRightField]).length
                          ? postalList[inputRightField]
                          : ""
                      }
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        let { value } = HandleMatchRegex(
                          inputValue,
                          currentRightRegex
                        );
                        setForm({
                          ...form,
                          [inputRightField]: {
                            content: inputValue,
                            errorMessage: value,
                          },
                        });
                      }}
                      className="input"
                      placeholder={currentRightField}
                    />
                  </InputGroup>
                )}
                {rightFieldHandler === true && (
                  <label
                    style={{
                      fontSize: "12px",
                      color: "red",
                      textAlign: "center",
                      margin: "-5px auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {currentRightExceptionR}
                  </label>
                )}
                {i === 4 && (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <button className="btn-action">
                          Libreta de direcciones
                        </button>
                        <button
                          onClick={() => {
                            setUrl(`contact`);
                            setMethod("POST");
                            setBody(form);
                            setFetch(true);
                            setTimeout(() => {
                              setFetch(false);
                            }, 500);
                          }}
                          className="btn-action"
                        >
                          Guardar
                        </button>
                      </div>
                      <div>
                        <FormGroup check>
                          <Label check style={{ fontSize: "12px" }}>
                            <Input type="checkbox" />
                            Utilizar como dirección de facturación
                          </Label>
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <div
        style={{
          width: "360px",
          display: "flex",
          margin: "2rem auto",
          justifyContent: "center",
          marginLeft: "1rem",
          marginRight: "1rem",
        }}
      >
        {/* //Parte Derecha de la página */}
        <aside style={{ border: "1px solid gray" }}>
          <h3
            style={{
              backgroundColor: "rgb(230, 230, 230)",
              textAlign: "center",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              height: "3rem",
            }}
          >
            RESUMEN DE LA ORDEN
          </h3>
          {(productList &&
            productList.length &&
            productList.map((d, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "0.5rem 5%",
                  }}
                >
                  <img alt={i} width={38} height={38} src={d.image} />
                  <label
                    style={{
                      fontSize: "15px",
                      color: "gray",
                      margin: "auto 2rem",
                    }}
                  >
                    {d.name}
                  </label>
                  <label style={{ fontWeight: "bold" }}>${d.price}</label>
                  <div style={{ borderBottom: "1px solid gray" }}></div>
                </div>
              );
            })) ||
            "Cargando ..."}
          <button
            style={{
              color: "white",
              backgroundColor: "red",
              border: "none",
              padding: "5px",
              margin: "0.5rem 0.5rem 0.5rem auto",
              display: "flex",
            }}
          >
            Editar
          </button>
          <div
            style={{
              backgroundColor: "rgb(230, 230, 230)",
              margin: "auto",
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              height: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                SUBTOTAL
              </label>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                $13,974.oo
              </label>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                ENVÍO
              </label>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                A calcular
              </label>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "black",
              margin: "auto",
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              height: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                TOTAL
              </label>
              <label
                style={{
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                $13,974.oo
              </label>
            </div>
          </div>
        </aside>
      </div>
      {contact === "success" && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            textAlign: "center",
            padding: "1rem",
            margin: "1rem 10%",
            borderRadius: "8px",
            backgroundColor: "#47A437",
            left: "40%",
            transform: "translate(-50%, 0)",
            color: "white",
          }}
        >
          La compra se realizó exitosamente!
        </div>
      )}
    </div>
  );
}

export default React.memo(Body);
