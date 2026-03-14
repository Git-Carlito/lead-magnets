import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

interface LeadFormProps {
  leadMagnet: string;
  answers: Record<string, string>;
  result: string;
}

export function LeadForm({ leadMagnet, answers, result }: LeadFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = leadSchema.parse(value);
      await getSupabase()
        .from("leads")
        .insert({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || null,
          lead_magnet: leadMagnet,
          answers,
          result,
        });
    },
  });

  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Get your personalized plan</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          validators={{
            onBlur: z.string().min(1, "Name is required"),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                placeholder="Your name"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-destructive">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onBlur: z.string().email("Please enter a valid email"),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                placeholder="you@example.com"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-destructive">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <div>
              <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id={field.name}
                name={field.name}
                type="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.isSubmitting, state.isSubmitted]}>
          {([isSubmitting, isSubmitted]) =>
            isSubmitted ? (
              <p className="text-center font-medium text-primary">Thanks! Check your inbox.</p>
            ) : (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Get my results"}
              </Button>
            )
          }
        </form.Subscribe>
      </form>
    </div>
  );
}
