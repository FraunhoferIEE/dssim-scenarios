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
import {Scenario, ScenarioControllerInterface} from 'dssim-core';

export class DataService implements Scenario {
  scenario_name = 'Some Data Service trasfering data..';
  run = async (scenarioController: ScenarioControllerInterface) => {
    if (
      !process.env.SCECTR_CONNECTOR_IMAGE_HOSTNAME ||
      !process.env.SCECTR_CONNECTOR_IMAGE_PULL_USERNAME ||
      !process.env.SCECTR_CONNECTOR_IMAGE_PULL_PASSWORD
    )
      throw new Error('Environment Variable missing.');

    await scenarioController.envController.deployContainerizedService(
      'pi',
      {
        image:
          'registry.gitlab.cc-asp.fraunhofer.de/dssim/dssim-kubernetes-controller/dummyservice',
        pullSecret: {
          [process.env.SCECTR_CONNECTOR_IMAGE_HOSTNAME]: {
            username: process.env.SCECTR_CONNECTOR_IMAGE_PULL_USERNAME,
            password: process.env.SCECTR_CONNECTOR_IMAGE_PULL_PASSWORD,
          },
        },
      },
      [{port: 8000, name: 'default', path: '/'}],
      {
        failureThreshold: 20,
        httpGet: {
          path: '/ping',
          port: 8000,
          scheme: 'HTTP',
        },
        initialDelaySeconds: 15,
        periodSeconds: 10,
        successThreshold: 1,
        timeoutSeconds: 1,
      }
    );

    const provider = await scenarioController.startConnector(
      'admin',
      'password',
      'provider'
    );

    const artifact =
      await provider.componentController.createHttpEndpointArtifact(
        {
          name: 'My Pi Service',
        },
        'http://pi:8000/ping',
        'plain/text',
        undefined,
        undefined
      );

    await provider.componentController.createOfferForArtifact(
      artifact,
      {
        name: 'My Pi Service Offer',
        start: new Date(),
        end: new Date(new Date().getFullYear() + 1, 1, 1),
      },
      {
        mediaType: 'plain/text',
      },
      {name: 'Interesting math numbers'}
    );

    const consumer = await scenarioController.startConnector(
      'admin',
      'password',
      'consumer'
    );

    const result = await consumer.componentController.getFirstArtifact(
      provider.instanceController.endPointUrl!
    );
    scenarioController.log('debug', JSON.stringify(result), 'Scenario', {});
  };
}
