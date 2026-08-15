import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");

const publishableKeys = JSON.parse(
  Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!
);

const secretKeys = JSON.parse(
  Deno.env.get("SUPABASE_SECRET_KEYS")!
);

const publishableKey = publishableKeys["default"];
const secretKey = secretKeys["default"];

if (!supabaseUrl || !publishableKey || !secretKey) {
  throw new Error("Missing Supabase environment variables");
}

    // Проверяем пользователя по JWT
    const userClient = createClient(
      supabaseUrl,
      publishableKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const factId = Number(body.fact_id);

    if (!Number.isInteger(factId)) {
      return new Response(
        JSON.stringify({ error: "Invalid fact_id" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Service role используется ТОЛЬКО внутри Edge Function
    const admin = createClient(
  supabaseUrl,
  secretKey
);

    const { data: fact, error: factError } = await admin
      .from("game_facts")
      .select("filename")
      .eq("id", factId)
      .single();

    if (factError || !fact) {
      return new Response(
        JSON.stringify({ error: "Fact not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: signed, error: signedError } =
      await admin.storage
        .from("facts")
        .createSignedUrl(fact.filename, 300);

    if (signedError || !signed?.signedUrl) {
      console.error("Signed URL error:", signedError);

      return new Response(
        JSON.stringify({
          error: "Failed to create signed URL",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        fact_id: factId,
        image_url: signed.signedUrl,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("get-fact-image error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});