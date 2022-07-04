/**
 * TABLE    : salesforce.logistics__c
 */

import { Request, response, Response } from "express";
import { db } from "../db";

/**
 * GET
 * 모든 물류센터 표시
 */
export const logisticsList = async (req: Request, res: Response) => {
  try {
    const client = await db.connect();
    const result = await client.query(
      "select id, name, address__c, location__c, locationName__c from salesforce.logistics__c order by id asc"
    );
    res.json(result.rows);
    client.release();
  } catch (error) {
    res.send(["Something went wrong", error]);
  }
};

/**
 * POST
 * 새 물류센터 생성
 */
export const createLogistics = async (req: Request, res: Response) => {
  try {
    const { name, address, location } = req.query;
    const client = await db.connect();
    await client.query(
      `insert into salesforce.logistics__c
      (name, address__c, location__c)
      values
      ('${name}', '${address}', '${location}')`
    );
    client.release();
    res.status(200).send({ message: "OK" });
  } catch (err) {
    res.status(400).send(["Bad Request", err]);
  }
};

/**
 * GET
 * 선택한 지역의 물류센터 표시
 */
export const logisticsListByArea = async (req: Request, res: Response) => {
  try {
    const areaName = req.query.areaName;
    if (areaName == undefined) throw new Error("Area is not specified");

    const client = await db.connect();

    const designatedAreaSFID = await client.query(
      `select id, sfid, name from salesforce.area__c where name = '${areaName}'`
    );
    if (designatedAreaSFID.rows.length < 1) throw new Error("No such area");

    const areas = await client.query(`
    select
      locationName__c,
      id,
      name,
      address__c,
      location__c
    from
      salesforce.logistics__c
    where
      location__c = '${designatedAreaSFID.rows[0].sfid}'
    `);
    res.status(200).send(areas.rows);
    client.release();
  } catch (error) {
    res.status(400).send(["Bad Request", error]);
  }
};
