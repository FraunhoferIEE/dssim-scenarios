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
import {
  Scenario,
  ScenarioControllerInterface,
  UnrestrictedPolicy,
} from 'dssim-core';

export class PISzenario implements Scenario {
  scenario_name = 'Transfer PI as Value Artifact from Provider to Consumer';
  run = async (scenarioController: ScenarioControllerInterface) => {
    const connectors = await Promise.all([
      scenarioController.startConnector('admin', 'password', 'consumer'),
      scenarioController.startConnector('admin', 'password', 'provider'),
    ]);
    const consumer = connectors[0];
    const provider = connectors[1];

    const artifactId = await provider.componentController.createValueArtifact(
      {
        name: 'PI',
        description: '...',
      },
      '3.14159265359'
    );
    await provider.componentController.createOfferForArtifact(
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

    const connectorDescription =
      await consumer.componentController.getDescription(
        provider.instanceController.endPointUrl!
      );
    scenarioController.log(
      'debug',
      JSON.stringify(connectorDescription),
      'Scenario',
      {}
    );

    const requestedArtifact =
      await consumer.componentController.getFirstArtifact<string>(
        provider.instanceController.endPointUrl!
      );
    scenarioController.log(
      'debug',
      JSON.stringify(requestedArtifact),
      'Scenario',
      {}
    );
    if (requestedArtifact !== '3.14159265359') {
      throw new Error('Something is fishy.');
    }
  };
}
