import React, { Component } from "react";
import Batches from "../components/Batches";
import { Button } from "semantic-ui-react";
import Layout from "../components/Layout";

class Manufacturer extends Component {

    render() {
        return(
            <Layout>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" />
                <Batches/>
                <Button fluid primary={true}>Manufacture Batch</Button>
            </Layout>
        )
    }
}

export default Manufacturer;