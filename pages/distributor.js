import React, { Component } from "react";
import Batches from "../components/Batches";
import Layout from "../components/Layout";

class Distributor extends Component {
    render() {
        return (
            <Layout>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" />
                <Batches/>
            </Layout>
        )
    }
}

export default Distributor