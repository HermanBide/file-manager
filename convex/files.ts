import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

//mutation is an endpoint that can be called in the front end and will store entry into convex db
//post request
export const createFile = mutation({
  //store in convex db
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
      //verify if user is logged in
      const identity = await ctx.auth.getUserIdentity();
        //identity is checking if user is logged in 
      if(!identity) {
        throw new ConvexError("you must be logged in to upload a file")
      }
    //   identity.isAuthenticated = true;
      //name table you want "files"
    await ctx.db.insert("files", {
      name: args.name,
    });
  },
});

//get method to get from db
//get request
export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        //identity is checking if user is logged in 
      if(!identity) {
        throw new ConvexError([""])
      }
        return ctx.db.query("files").collect()
    }
})
