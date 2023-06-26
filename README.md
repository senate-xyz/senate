# Senate

**How to contribute**

All pull requests should be made to the **staging** branch.

## Adding DAOs (SnapShot)

To add a snapshot space to Senate, you will need to submit a pull request that adds the desired DAO to the seed.ts in
_senate/packages/database/src/seed.ts_

Add the following information at the end of the DAO list.

``` 
  const [Insert DAO Name] = await prisma.dAO.upsert({
        where: { name: '[Insert DAO Name]' },
        update: {},
        create: {
            name: '[Insert DAO Name]',
            picture: '/assets/Project_Icons/[Insert DAO Name]',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: '[Insert DAO Name].eth'
                        }
                    }
                ]
            }
        }
    })
```

Add this to the "inserting subscription" section of seed.ts

```
  prisma.subscription.upsert({
                  where: {
                      userId_daoId: {
                          userId: seedUser.id,
                          daoId: [Insert DAO Name].id
                      }
                  },
                  create: {
                      userId: seedUser.id,
                      daoId: [Insert DAO Name].id
                  },
                  update: {}
``` 

**Logos**

Contact Paulo on the Senate [Discord]([https://discord.gg/XH5VPpUX](https://discord.gg/XH5VPpUX)) to get the relevant
images, 1 svg file and 4 png files.

Upload the Logos to the following file **Project_Icons** found in _senate/apps/senate/public/assets/Project_Icons_




