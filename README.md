# dssim-scenarios

This is a implementation of the **DataSpace-Execution** Module of the **D**ata**S**pace**SIM**ulation (DSSIM) Framework. It contains a graphical or text-based user interface, scenario descriptions, configurations, and assets. It instantiates the Scenario-Controller with the loaded configuration and passes the scenario description to it for execution.

## The DSSIM-Framework

The DSSIM-Framework was initially created as part of a Master-Thesis. Here's the abstract:

_To promote digital ecosystems, various projects and initiatives are currently underway to establish data spaces for sovereign data exchange. Due to the diverse design options regarding architecture, technologies and processes, there is a need for technical support to facilitate experimentation in this context. This paper proposes a technical framework that enables the description, simulation, and evaluation of data space scenarios. Initially, goals are defined, fundamentals are described, and related work is analyzed. The main part provides a detailed description of the reference implementation of the framework. An evaluation based on a practical project demonstrates its suitability for the application area._

## Documentation / Usage

1. Write your dataspace scenario and place the description file in src/scenarios/

1. Add the classname of your scenario to the scenarios list in the index.ts file

1. Edit necessary parts of the .env file. If you don't need network control, a logging pipeline or pull secrets for your containers, you can just remove the line.

```
# System vars
NODE_TLS_REJECT_UNAUTHORIZED=0

# Kubernetes Controller vars
K8S_KUBECONFIG_PATH=<EDIT>
K8S_NAMESPACE=<EDIT>
K8S_GROUPLABEL=<EDIT>

## Network Control Image and Pull Secret
K8S_NETCONTROL_IMAGE=<EDIT>
K8S_NETCONTROL_IMAGE_HOSTNAME=<EDIT>
K8S_NETCONTROL_IMAGE_PULL_USERNAME=<EDIT>
K8S_NETCONTROL_IMAGE_PULL_PASSWORD=<EDIT>
K8S_NETCONTROL_IFPREFIX=<EDIT>

## Loki Logging Pipeline
#LOKI_URL=<EDIT>
#LOKI_USERNAME=<EDIT>
#LOKI_PASSWORD=<EDIT>

# Scenario Controller vars
## Connector Image Pull Secret
SCECTR_CONNECTOR_IMAGE_HOSTNAME=<EDIT>
SCECTR_CONNECTOR_IMAGE_PULL_USERNAME=<EDIT>
SCECTR_CONNECTOR_IMAGE_PULL_PASSWORD=<EDIT>


# Scenario specific vars
## SYSANDUK
SYSANDUK_USERNAME=<USERNAME>
SYSANDUK_PASSWORD=<PASSWORD>

# Daps
OMEJDNKEY=<OMEJDNKEY>
CONNECTORCERT=<OMEJDNKEY>
```

1. install dependencies

```bash
npm install
```

1. run the execution module

```bash
npm run start
```

1. follow the guide and select configuration and scenario to run

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)
