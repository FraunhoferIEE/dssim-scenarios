/*
 * Copyright 2023 Fraunhofer IEE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *       Michel Otto - initial implementation
 *
 */
import {DSCController, IDSBrokerController} from 'dssim-ids-controller';
import {DSCInstance} from 'dssim-kubernetes-controller';
import {
  Instance,
  Scenario,
  ScenarioControllerInterface,
  UnrestrictedPolicy,
} from 'dssim-core';
import {brokerFactory} from '../configurations/brokerFactory.js';

export class ExplicitController implements Scenario {
  scenario_name = 'explicit controller example';
  run = async (scenarioController: ScenarioControllerInterface) => {
    const provider = await scenarioController.startConnector<
      DSCInstance,
      DSCController
    >(
      'admin',
      'password',
      'provider',
      new DSCInstance('provider', 'admin', 'password', [
        {
          image:
            'registry.gitlab.cc-asp.fraunhofer.de/dssim/dssim-kubernetes-controller/ids-dataspace-connector-dssim:7.1.0',
          pullSecret: {
            [process.env.SCECTR_CONNECTOR_IMAGE_HOSTNAME!]: {
              username: process.env.SCECTR_CONNECTOR_IMAGE_PULL_USERNAME!,
              password: process.env.SCECTR_CONNECTOR_IMAGE_PULL_PASSWORD!,
            },
          },
        },
      ]),
      DSCController
    );

    const artifactId = await provider.componentController.createValueArtifact(
      {
        name: 'PI',
        description: '...',
      },
      '3.14159265359'
    );
    const offerId = await provider.componentController.createOfferForArtifact(
      artifactId,
      {
        name: 'Free PI Value',
        license: 'http://opendatacommons.org/licenses/odbl/1.0/',
        sovereign: 'https://www.iee.fraunhofer.de/',
        start: new Date(2022, 1, 1),
        end: new Date(2025, 1, 1),
      },
      {
        name: 'English number format. Dot as Decimal seperator.',
        mediaType: 'plain/text',
      },
      {
        name: 'Cool Numbers Catalog',
      },
      new UnrestrictedPolicy()
    );
    scenarioController.log('debug', JSON.stringify(offerId), 'Scenario', {});

    const myBroker = await scenarioController.startBroker<
      Instance,
      IDSBrokerController
    >(
      brokerFactory(),
      new IDSBrokerController('broker', 'username', 'password', [
        {name: 'root', path: '/api/ids', port: 8080},
      ])
    );
    myBroker.componentController.brokerApi;
    //consumer.componentController.connectorApi.routesService.createRoute(..);

    await provider.componentController.connectorApi.brokerService.createBroker({
      title: 'Testbroker',
      location: `http://${myBroker.instanceController.hostname}:8080/api/ids`,
    });

    await provider.componentController.connectorApi.messagingService.sendConnectorUpdateMessage(
      `http://${myBroker.instanceController.hostname}:8080/api/ids`
    );

    await provider.componentController.connectorApi.messagingService.sendResourceUpdateMessage(
      `http://${myBroker.instanceController.hostname}:8080/api/ids`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (offerId as any)['id']
    );
  };
}
