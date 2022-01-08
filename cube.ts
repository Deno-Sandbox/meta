export class meta{
    private meta: any = []
    
    constructor(){
        //no args for the moment
        //generate the meta point
        this.createMetaPoint();
    }

    /**
     * Let's make a simple explication of this meta project.
     * 
     * y
     * ^
     * |
     * |  z
     * | /
     * |/
     * +---------> x
     * 
     * Now let's difine some points.
     *     - {0, 0, 0} is the meta point
     *     - full encadred cube are hiddien one
     *     - none encadred cube are isoled cube
     *     - groups of independant cube are called island
     * 
     * Now one cube is a 3D cube so he has 6 faces sooo fudamental cubes need 2x9+8=26 points to be a fundamental cube.
     * 
     * Now let's talk about the cube power: 
     *      - depand of X, Y, Z
     *      - if X = 0, Y = 0, Z = 0, max point !
     *      - more little is, better is the cube
     *   
     * Calculate the cube power:
     *      - power = (X)^2 + (|X-Y|)^2 + (|(|X-Y|)+Z|)^2
     * 
     */

    private createMetaPoint(){
        //The meta point is the point that is the center of the meta cube.
        // so coord need to be {0, 0, 0}
        this.createCube(0, 0, 0);
    }

    public createCube(x: number, y: number, z: number){
        //First check if they are a cube supperposition or not.
        let checkCube = this.meta.filter(cube => cube.x == x && cube.y == y && cube.z == z);
        if(checkCube.length > 0){
            return false;
        } else {
            this.meta.push({x: x, y: y, z: z, data: {}});
            return true;
        }
    }

    private getAdjacentCube(searchCube: any){
        let adjacentCube = this.meta.filter(cube => (cube.x == searchCube.x + 1 || cube.x == searchCube.x - 1) && (cube.y == searchCube.y + 1 || cube.y == searchCube.y - 1) && (cube.z == searchCube.z + 1 || cube.z == searchCube.z - 1));
        return adjacentCube;
    }

    public getCube(x: number, y: number, z: number){
        let cube = this.meta.find(cube => cube.x == x && cube.y == y && cube.z == z);
        return cube;
    }

    public getRandomCube(){
        return this.meta[Math.floor(Math.random() * this.meta.length)];
    }

    public getCubePower(cube){
        //power = (X)^2 + (|X-Y|)^2 + (|(|X-Y|)+Z|)^2
        return Math.pow(cube.x, 2) + Math.pow(Math.abs(cube.x - cube.y), 2) + Math.pow(Math.abs(Math.abs(cube.x - cube.y) + cube.z), 2)
    }

    public getCubeData(x: number, y: number, z: number){
        let cube = this.meta.filter(cube => cube.x == x && cube.y == y && cube.z == z);
        return cube[0].data;
    }

    public mooveCube(cube: any, x: number, y: number, z: number){
        let checkCube = this.meta.filter(search => search.x == x && search.y == y && search.z == z);
        if(checkCube.length > 0){
            return false
        } else {
            //get cube index
            let index = this.meta.findIndex(search => search.x == cube.x && search.y == cube.y && search.z == cube.z);
            //change the cube position
            this.meta[index].x = x;
            this.meta[index].y = y;
            this.meta[index].z = z;
            return true
        }
    }

    public generateCubeRoad(entryCube: any, exitCube: any){
        //We need to find the path between the entry and the exit cube with other cubes.

        console.log('EntryCube', entryCube)
        console.log('ExitCube', exitCube)

        let road = [entryCube]
        let find = false;
        let exit = false;
        let max = 0;
        let count = 0;

        let precedance = []

        //for each cube we need to find the adjacent cubes.
        //check if the adjacent cube is in the exit cube.
        //if it is, we have the path.

        while(!find){
            // this is my brain fuck xD

            for(let i=0; i<road.length; i++){
                //get the adjacent cube
                let adjacentCube = this.getAdjacentCube(road[i]);
                for(let j=0; j<adjacentCube.length; j++){
                    //check if not in the road
                    let checkCubeInRoad = road.find(cube => cube.x == adjacentCube[j].x && cube.y == adjacentCube[j].y && cube.z == adjacentCube[j].z);
                    if(!checkCubeInRoad){
                        //can add it to the road
                        road.push(adjacentCube[j]);
                        precedance.push({
                            prev: road[i],
                            next: adjacentCube[j]
                        })
                        if(adjacentCube[j].x == exitCube.x && adjacentCube[j].y == exitCube.y && adjacentCube[j].z == exitCube.z){
                            find = true;
                            exit = true;
                            break;
                        }
                    } 
                }
            }

            
            if(road.length == max && max != 0){
                count++
                if(count == road.length){
                    find = true;
                }
            } else {
                max = road.length;
                count = 0
            }
        }

        if(exit){
            return this.resolvePrecedance(precedance)
        } else {
            return []
        }

    }

    private resolvePrecedance(precedance: any){
        let deb = precedance[0].prev
        let fin = precedance[precedance.length-1].next
        let road = []
        let out = false
        
        let pre = {prev: fin, next: null}
        
        while(!out){
            road.push(pre.prev)
            pre = precedance.find(nodes => pre.prev.x == nodes.next.x && pre.prev.y == nodes.next.y && pre.prev.z == nodes.next.z)
            if(pre.prev == deb){
                out = true
            }
        }
        road.push(deb)
        road = this.reverseArray(road)
        return road
    }

    private reverseArray(array: any){
        let newArray = []
        for(let i=array.length-1; i>=0; i--){
            newArray.push(array[i])
        }
        return newArray
    }

    public generateRandomMeta(xDis: Number, yDis: Number, zDis: Number, nbCube: Number){
        //generate a random meta cube

        for(let i=0; i<nbCube-1; i++){
            let x = (Math.floor(Math.random() * xDis)) - (Math.floor(Math.random() * xDis));
            let y = (Math.floor(Math.random() * yDis)) - (Math.floor(Math.random() * yDis));
            let z = (Math.floor(Math.random() * zDis)) - (Math.floor(Math.random() * zDis));
            if(!this.createCube(x, y, z)){
                i--;
            }
        }
    }

}