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

export class GetDescription implements Scenario {
  scenario_name = 'Simple Get Description Scenario';
  run = async (scenarioController: ScenarioControllerInterface) => {
    const connectors = await Promise.all([
      scenarioController.startConnector('admin', 'password', 'consumer'),
      scenarioController.startConnector('admin', 'password', 'provider'),
    ]);

    const connectorDescription =
      await connectors[0].componentController.getDescription(
        connectors[1].instanceController.endPointUrl!
      );

    connectors[0].componentController;

    scenarioController.log(
      'debug',
      JSON.stringify(connectorDescription),
      'Scenario',
      {}
    );
  };
}
